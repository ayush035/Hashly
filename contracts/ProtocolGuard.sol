// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SentinelRegistry.sol";

/**
 * @title ProtocolGuard
 * @notice Circuit-breaker system that allows authorized Sentinel agents to
 *         pause monitored protocols when exploits are detected. Acts as the
 *         enforcement layer for Sentin0G's autonomous security network.
 * @dev Protocols register with ProtocolGuard and assign Sentinel guardians.
 *      When a Sentinel detects an exploit via 0G Compute, it submits evidence
 *      and triggers the circuit breaker. Manual review can resume operations.
 */
contract ProtocolGuard {

    // ─── Structs ────────────────────────────────────────────────────────

    struct ProtocolConfig {
        address protocol;
        string name;
        bool isRegistered;
        bool isPaused;
        uint256 totalAlerts;
        uint256 totalPauses;
        uint256 registeredAt;
        uint256 lastAlertAt;
        uint256[] assignedSentinels;     // Sentinel IDs authorized to protect this protocol
        uint256 minThreatLevelForPause;  // Minimum threat level (1-10) to auto-pause
    }

    struct Alert {
        uint256 id;
        address protocol;
        uint256 sentinelId;
        uint256 threatLevel;           // 1-10 severity
        string threatType;            // REENTRANCY, FLASH_LOAN, ORACLE_MANIPULATION, etc.
        string evidenceHash;          // Hash of evidence stored on 0G Storage
        uint256 timestamp;
        AlertStatus status;
    }

    enum AlertStatus { ACTIVE, RESOLVED, FALSE_POSITIVE }

    // ─── State ──────────────────────────────────────────────────────────

    SentinelRegistry public sentinelRegistry;
    address public admin;

    mapping(address => ProtocolConfig) public protocols;
    address[] public registeredProtocols;

    uint256 private _nextAlertId;
    mapping(uint256 => Alert) public alerts;
    uint256[] public allAlertIds;

    // Protocol -> Sentinel ID -> authorized
    mapping(address => mapping(uint256 => bool)) public sentinelAuthorized;

    // ─── Events ─────────────────────────────────────────────────────────

    event ProtocolRegistered(
        address indexed protocol,
        string name,
        uint256 minThreatLevel
    );

    event SentinelAssigned(
        address indexed protocol,
        uint256 indexed sentinelId
    );

    event AlertRaised(
        uint256 indexed alertId,
        address indexed protocol,
        uint256 indexed sentinelId,
        uint256 threatLevel,
        string threatType
    );

    event CircuitBreakerTriggered(
        address indexed protocol,
        uint256 indexed alertId,
        uint256 indexed sentinelId,
        uint256 threatLevel
    );

    event ProtocolResumed(
        address indexed protocol,
        uint256 indexed alertId,
        address indexed resolvedBy
    );

    event AlertResolved(
        uint256 indexed alertId,
        AlertStatus resolution
    );

    // ─── Modifiers ──────────────────────────────────────────────────────

    modifier onlyAdmin() {
        require(msg.sender == admin, "ProtocolGuard: caller is not admin");
        _;
    }

    modifier protocolRegistered(address protocol) {
        require(protocols[protocol].isRegistered, "ProtocolGuard: protocol not registered");
        _;
    }

    // ─── Constructor ────────────────────────────────────────────────────

    constructor(address _sentinelRegistry) {
        admin = msg.sender;
        sentinelRegistry = SentinelRegistry(_sentinelRegistry);
        _nextAlertId = 1;
    }

    // ─── Protocol Management ────────────────────────────────────────────

    /**
     * @notice Register a protocol for Sentinel monitoring
     * @param protocol The protocol contract address
     * @param name Human-readable protocol name
     * @param minThreatLevel Minimum threat level (1-10) required to trigger auto-pause
     */
    function registerProtocol(
        address protocol,
        string calldata name,
        uint256 minThreatLevel
    ) external onlyAdmin {
        require(!protocols[protocol].isRegistered, "ProtocolGuard: already registered");
        require(minThreatLevel >= 1 && minThreatLevel <= 10, "ProtocolGuard: invalid threat level");

        protocols[protocol] = ProtocolConfig({
            protocol: protocol,
            name: name,
            isRegistered: true,
            isPaused: false,
            totalAlerts: 0,
            totalPauses: 0,
            registeredAt: block.timestamp,
            lastAlertAt: 0,
            assignedSentinels: new uint256[](0),
            minThreatLevelForPause: minThreatLevel
        });

        registeredProtocols.push(protocol);

        emit ProtocolRegistered(protocol, name, minThreatLevel);
    }

    /**
     * @notice Assign a Sentinel to guard a protocol
     * @param protocol The protocol to guard
     * @param sentinelId The Sentinel Agentic ID to assign
     */
    function assignSentinel(
        address protocol,
        uint256 sentinelId
    ) external onlyAdmin protocolRegistered(protocol) {
        require(!sentinelAuthorized[protocol][sentinelId], "ProtocolGuard: sentinel already assigned");

        // Verify sentinel exists
        SentinelRegistry.Sentinel memory sentinel = sentinelRegistry.getSentinel(sentinelId);
        require(sentinel.status == SentinelRegistry.SentinelStatus.ACTIVE, "ProtocolGuard: sentinel not active");

        sentinelAuthorized[protocol][sentinelId] = true;
        protocols[protocol].assignedSentinels.push(sentinelId);

        emit SentinelAssigned(protocol, sentinelId);
    }

    // ─── Alert & Circuit Breaker ────────────────────────────────────────

    /**
     * @notice Raise a security alert and optionally trigger circuit breaker
     * @dev Called by the backend when a Sentinel detects a threat via 0G Compute
     * @param protocol The target protocol under threat
     * @param sentinelId The Sentinel that detected the threat
     * @param threatLevel Severity 1-10
     * @param threatType Classification (REENTRANCY, FLASH_LOAN, etc.)
     * @param evidenceHash Hash of evidence data stored on 0G Storage
     */
    function raiseAlert(
        address protocol,
        uint256 sentinelId,
        uint256 threatLevel,
        string calldata threatType,
        string calldata evidenceHash
    ) external onlyAdmin protocolRegistered(protocol) {
        require(threatLevel >= 1 && threatLevel <= 10, "ProtocolGuard: invalid threat level");

        uint256 alertId = _nextAlertId++;

        alerts[alertId] = Alert({
            id: alertId,
            protocol: protocol,
            sentinelId: sentinelId,
            threatLevel: threatLevel,
            threatType: threatType,
            evidenceHash: evidenceHash,
            timestamp: block.timestamp,
            status: AlertStatus.ACTIVE
        });

        allAlertIds.push(alertId);

        ProtocolConfig storage config = protocols[protocol];
        config.totalAlerts++;
        config.lastAlertAt = block.timestamp;

        emit AlertRaised(alertId, protocol, sentinelId, threatLevel, threatType);

        // Record detection in SentinelRegistry (boosts reputation)
        sentinelRegistry.recordDetection(sentinelId, protocol, threatLevel);

        // Auto-trigger circuit breaker if threat level meets threshold
        if (threatLevel >= config.minThreatLevelForPause && !config.isPaused) {
            config.isPaused = true;
            config.totalPauses++;

            emit CircuitBreakerTriggered(protocol, alertId, sentinelId, threatLevel);
        }
    }

    /**
     * @notice Resolve an alert and optionally resume protocol
     * @param alertId The alert to resolve
     * @param isFalsePositive Whether this was a false positive
     */
    function resolveAlert(
        uint256 alertId,
        bool isFalsePositive
    ) external onlyAdmin {
        Alert storage alert = alerts[alertId];
        require(alert.timestamp != 0, "ProtocolGuard: alert does not exist");
        require(alert.status == AlertStatus.ACTIVE, "ProtocolGuard: alert not active");

        if (isFalsePositive) {
            alert.status = AlertStatus.FALSE_POSITIVE;
            sentinelRegistry.recordFalsePositive(alert.sentinelId);
        } else {
            alert.status = AlertStatus.RESOLVED;
        }

        emit AlertResolved(alertId, alert.status);
    }

    /**
     * @notice Resume a paused protocol after investigation
     * @param protocol The protocol to resume
     */
    function resumeProtocol(
        address protocol
    ) external onlyAdmin protocolRegistered(protocol) {
        require(protocols[protocol].isPaused, "ProtocolGuard: protocol not paused");
        protocols[protocol].isPaused = false;

        emit ProtocolResumed(protocol, 0, msg.sender);
    }

    // ─── View Functions ─────────────────────────────────────────────────

    function getProtocol(address protocol) external view returns (ProtocolConfig memory) {
        return protocols[protocol];
    }

    function getAlert(uint256 alertId) external view returns (Alert memory) {
        return alerts[alertId];
    }

    function getRegisteredProtocols() external view returns (address[] memory) {
        return registeredProtocols;
    }

    function getAllAlertIds() external view returns (uint256[] memory) {
        return allAlertIds;
    }

    function totalAlerts() external view returns (uint256) {
        return _nextAlertId - 1;
    }

    function isProtocolPaused(address protocol) external view returns (bool) {
        return protocols[protocol].isPaused;
    }

    function getProtocolSentinels(address protocol) external view returns (uint256[] memory) {
        return protocols[protocol].assignedSentinels;
    }

    // ─── Admin Functions ────────────────────────────────────────────────

    function setAdmin(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }

    function updateMinThreatLevel(
        address protocol,
        uint256 newLevel
    ) external onlyAdmin protocolRegistered(protocol) {
        require(newLevel >= 1 && newLevel <= 10, "ProtocolGuard: invalid threat level");
        protocols[protocol].minThreatLevelForPause = newLevel;
    }
}

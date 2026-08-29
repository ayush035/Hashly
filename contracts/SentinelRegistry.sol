// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SentinelRegistry
 * @notice ERC-7857 Agentic ID implementation for Sentin0G security guardians.
 *         Each Sentinel is a tokenized AI agent that evolves as it detects exploits.
 *         Implements encrypted metadata storage (pointing to 0G Storage) and
 *         dynamic reputation scores that appreciate with successful detections.
 * @dev Simplified ERC-7857 pattern for hackathon MVP. Full ERC-7857 adds
 *      TEE/ZKP oracle transfers and re-encryption on ownership change.
 */
contract SentinelRegistry {

    // ─── Structs ────────────────────────────────────────────────────────

    struct Sentinel {
        uint256 id;
        address owner;
        string name;
        string metadataURI;        // Points to 0G Storage (encrypted agent state)
        uint256 reputation;        // Starts at 100, evolves with detections
        uint256 totalDetections;
        uint256 falsePositives;
        uint256 createdAt;
        uint256 lastActiveAt;
        SentinelStatus status;
        SentinelTier tier;
    }

    enum SentinelStatus { ACTIVE, PAUSED, DECOMMISSIONED }

    enum SentinelTier { SCOUT, GUARDIAN, WARDEN, OVERLORD }
    // SCOUT: 0-249 rep | GUARDIAN: 250-499 | WARDEN: 500-749 | OVERLORD: 750+

    // ─── State ──────────────────────────────────────────────────────────

    uint256 private _nextTokenId;
    mapping(uint256 => Sentinel) public sentinels;
    mapping(address => uint256[]) public ownerSentinels;
    mapping(uint256 => mapping(address => bool)) public authorizedOperators;

    address public admin;
    address public protocolGuard; // ProtocolGuard contract address

    // ─── Events ─────────────────────────────────────────────────────────

    event SentinelMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string name,
        string metadataURI
    );

    event SentinelTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
    );

    event ReputationUpdated(
        uint256 indexed tokenId,
        uint256 oldReputation,
        uint256 newReputation,
        SentinelTier newTier
    );

    event DetectionRecorded(
        uint256 indexed tokenId,
        address indexed protocol,
        uint256 threatLevel,
        uint256 timestamp
    );

    event MetadataUpdated(
        uint256 indexed tokenId,
        string oldURI,
        string newURI
    );

    event SentinelStatusChanged(
        uint256 indexed tokenId,
        SentinelStatus newStatus
    );

    // ─── Modifiers ──────────────────────────────────────────────────────

    modifier onlyAdmin() {
        require(msg.sender == admin, "SentinelRegistry: caller is not admin");
        _;
    }

    modifier onlyOwnerOrOperator(uint256 tokenId) {
        require(
            sentinels[tokenId].owner == msg.sender ||
            authorizedOperators[tokenId][msg.sender] ||
            msg.sender == admin ||
            msg.sender == protocolGuard,
            "SentinelRegistry: not authorized"
        );
        _;
    }

    modifier sentinelExists(uint256 tokenId) {
        require(sentinels[tokenId].createdAt != 0, "SentinelRegistry: sentinel does not exist");
        _;
    }

    // ─── Constructor ────────────────────────────────────────────────────

    constructor() {
        admin = msg.sender;
        _nextTokenId = 1;
    }

    // ─── Core Functions ─────────────────────────────────────────────────

    /**
     * @notice Mint a new Sentinel Agentic ID
     * @param name Human-readable name for the Sentinel
     * @param metadataURI URI pointing to encrypted metadata on 0G Storage
     * @return tokenId The ID of the newly minted Sentinel
     */
    function mintSentinel(
        string calldata name,
        string calldata metadataURI
    ) external returns (uint256 tokenId) {
        tokenId = _nextTokenId++;

        sentinels[tokenId] = Sentinel({
            id: tokenId,
            owner: msg.sender,
            name: name,
            metadataURI: metadataURI,
            reputation: 100,
            totalDetections: 0,
            falsePositives: 0,
            createdAt: block.timestamp,
            lastActiveAt: block.timestamp,
            status: SentinelStatus.ACTIVE,
            tier: SentinelTier.SCOUT
        });

        ownerSentinels[msg.sender].push(tokenId);

        emit SentinelMinted(tokenId, msg.sender, name, metadataURI);
    }

    /**
     * @notice Transfer a Sentinel to a new owner (simplified ERC-7857 transfer)
     * @dev In full ERC-7857, this would involve oracle re-encryption of metadata
     * @param tokenId The Sentinel to transfer
     * @param to The new owner
     */
    function transferSentinel(
        uint256 tokenId,
        address to
    ) external sentinelExists(tokenId) {
        require(sentinels[tokenId].owner == msg.sender, "SentinelRegistry: not owner");
        require(to != address(0), "SentinelRegistry: transfer to zero address");

        address from = sentinels[tokenId].owner;
        sentinels[tokenId].owner = to;

        // Remove from old owner's list
        _removeFromOwnerList(from, tokenId);
        // Add to new owner's list
        ownerSentinels[to].push(tokenId);

        emit SentinelTransferred(tokenId, from, to);
    }

    /**
     * @notice Record a successful threat detection and update reputation
     * @param tokenId The Sentinel that detected the threat
     * @param protocol The protocol where the threat was detected
     * @param threatLevel 1-10 severity scale
     */
    function recordDetection(
        uint256 tokenId,
        address protocol,
        uint256 threatLevel
    ) external onlyOwnerOrOperator(tokenId) sentinelExists(tokenId) {
        require(threatLevel >= 1 && threatLevel <= 10, "SentinelRegistry: invalid threat level");

        Sentinel storage sentinel = sentinels[tokenId];
        require(sentinel.status == SentinelStatus.ACTIVE, "SentinelRegistry: sentinel not active");

        uint256 oldReputation = sentinel.reputation;

        // Reputation boost based on threat severity
        uint256 reputationGain = threatLevel * 5; // 5-50 points per detection
        sentinel.reputation += reputationGain;
        sentinel.totalDetections++;
        sentinel.lastActiveAt = block.timestamp;

        // Update tier
        sentinel.tier = _calculateTier(sentinel.reputation);

        emit DetectionRecorded(tokenId, protocol, threatLevel, block.timestamp);
        emit ReputationUpdated(tokenId, oldReputation, sentinel.reputation, sentinel.tier);
    }

    /**
     * @notice Record a false positive (reduces reputation)
     * @param tokenId The Sentinel that produced the false positive
     */
    function recordFalsePositive(
        uint256 tokenId
    ) external onlyAdmin sentinelExists(tokenId) {
        Sentinel storage sentinel = sentinels[tokenId];
        uint256 oldReputation = sentinel.reputation;

        // Penalty for false positive
        if (sentinel.reputation > 25) {
            sentinel.reputation -= 25;
        } else {
            sentinel.reputation = 0;
        }

        sentinel.falsePositives++;
        sentinel.tier = _calculateTier(sentinel.reputation);

        emit ReputationUpdated(tokenId, oldReputation, sentinel.reputation, sentinel.tier);
    }

    /**
     * @notice Update the encrypted metadata URI (e.g., after agent learning)
     * @param tokenId The Sentinel to update
     * @param newMetadataURI New URI pointing to updated encrypted state on 0G Storage
     */
    function updateMetadata(
        uint256 tokenId,
        string calldata newMetadataURI
    ) external onlyOwnerOrOperator(tokenId) sentinelExists(tokenId) {
        string memory oldURI = sentinels[tokenId].metadataURI;
        sentinels[tokenId].metadataURI = newMetadataURI;
        sentinels[tokenId].lastActiveAt = block.timestamp;

        emit MetadataUpdated(tokenId, oldURI, newMetadataURI);
    }

    /**
     * @notice Change Sentinel status
     * @param tokenId The Sentinel to modify
     * @param newStatus The new status
     */
    function setSentinelStatus(
        uint256 tokenId,
        SentinelStatus newStatus
    ) external onlyOwnerOrOperator(tokenId) sentinelExists(tokenId) {
        sentinels[tokenId].status = newStatus;
        emit SentinelStatusChanged(tokenId, newStatus);
    }

    /**
     * @notice Authorize an operator (e.g., ProtocolGuard) for a Sentinel
     * @param tokenId The Sentinel
     * @param operator The address to authorize
     * @param authorized Whether to grant or revoke
     */
    function setOperator(
        uint256 tokenId,
        address operator,
        bool authorized
    ) external sentinelExists(tokenId) {
        require(sentinels[tokenId].owner == msg.sender, "SentinelRegistry: not owner");
        authorizedOperators[tokenId][operator] = authorized;
    }

    // ─── Admin Functions ────────────────────────────────────────────────

    function setProtocolGuard(address _protocolGuard) external onlyAdmin {
        protocolGuard = _protocolGuard;
    }

    function setAdmin(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }

    // ─── View Functions ─────────────────────────────────────────────────

    function getSentinel(uint256 tokenId) external view returns (Sentinel memory) {
        require(sentinels[tokenId].createdAt != 0, "SentinelRegistry: sentinel does not exist");
        return sentinels[tokenId];
    }

    function getOwnerSentinels(address owner) external view returns (uint256[] memory) {
        return ownerSentinels[owner];
    }

    function totalSentinels() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    function getSentinelTier(uint256 tokenId) external view sentinelExists(tokenId) returns (SentinelTier) {
        return sentinels[tokenId].tier;
    }

    // ─── Internal Functions ─────────────────────────────────────────────

    function _calculateTier(uint256 reputation) internal pure returns (SentinelTier) {
        if (reputation >= 750) return SentinelTier.OVERLORD;
        if (reputation >= 500) return SentinelTier.WARDEN;
        if (reputation >= 250) return SentinelTier.GUARDIAN;
        return SentinelTier.SCOUT;
    }

    function _removeFromOwnerList(address owner, uint256 tokenId) internal {
        uint256[] storage tokens = ownerSentinels[owner];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }
    }
}

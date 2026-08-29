// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VulnerableVault
 * @notice A deliberately vulnerable DeFi vault for Sentin0G demo purposes.
 *         Contains intentional reentrancy and flash loan vulnerabilities that
 *         Sentinel agents detect and the ProtocolGuard pauses.
 * @dev DO NOT use in production. This contract is intentionally insecure.
 */
contract VulnerableVault {

    mapping(address => uint256) public balances;
    uint256 public totalDeposits;
    bool public paused;
    address public guardian; // ProtocolGuard address

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event VaultPaused(address indexed by);
    event VaultResumed(address indexed by);

    modifier whenNotPaused() {
        require(!paused, "VulnerableVault: paused by ProtocolGuard");
        _;
    }

    modifier onlyGuardian() {
        require(
            msg.sender == guardian || guardian == address(0),
            "VulnerableVault: not guardian"
        );
        _;
    }

    constructor() {
        guardian = msg.sender;
    }

    /**
     * @notice Set the ProtocolGuard as guardian
     */
    function setGuardian(address _guardian) external {
        require(msg.sender == guardian, "VulnerableVault: not authorized");
        guardian = _guardian;
    }

    /**
     * @notice Deposit ETH into the vault
     */
    function deposit() external payable whenNotPaused {
        require(msg.value > 0, "VulnerableVault: zero deposit");
        balances[msg.sender] += msg.value;
        totalDeposits += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    /**
     * @notice Withdraw ETH from the vault
     * @dev VULNERABILITY: Uses external call before state update (reentrancy)
     */
    function withdraw(uint256 amount) external whenNotPaused {
        require(balances[msg.sender] >= amount, "VulnerableVault: insufficient balance");

        // VULNERABLE: External call before state update
        // A reentrancy attacker can call withdraw() again in the receive() fallback
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "VulnerableVault: transfer failed");

        // State update happens AFTER the external call — reentrancy window
        balances[msg.sender] -= amount;
        totalDeposits -= amount;

        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @notice Emergency pause by ProtocolGuard
     */
    function pause() external onlyGuardian {
        paused = true;
        emit VaultPaused(msg.sender);
    }

    /**
     * @notice Resume operations
     */
    function resume() external onlyGuardian {
        paused = false;
        emit VaultResumed(msg.sender);
    }

    /**
     * @notice Get vault balance
     */
    function getVaultBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Get user balance
     */
    function getUserBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    receive() external payable {}
}

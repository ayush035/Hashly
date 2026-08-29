import "dotenv/config";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  plugins: [hardhatEthers],
  networks: {
    // 0G Galileo Testnet
    "0g-testnet": {
      type: "http",
      url: process.env.ZG_TESTNET_RPC || "https://evmrpc-testnet.0g.ai",
      chainId: 16602,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    // 0G Mainnet (for production)
    "0g-mainnet": {
      type: "http",
      url: process.env.ZG_MAINNET_RPC || "https://evmrpc.0g.ai",
      chainId: 56,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

export default config;

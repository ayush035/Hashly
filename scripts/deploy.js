import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { ethers } from "ethers";
import fs from "fs";

// Read compiled artifacts
function readArtifact(name) {
  const path = `./artifacts/contracts/${name}.sol/${name}.json`;
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

async function main() {
  const rpc = process.env.ZG_TESTNET_RPC || "https://evmrpc-testnet.0g.ai";
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Deploying contracts with account:", wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log("Account balance:", ethers.formatEther(balance), "OG");

  if (balance === 0n) {
    console.error("No balance — fund the wallet first.");
    process.exit(1);
  }

  // 1. Deploy SentinelRegistry
  console.log("\nDeploying SentinelRegistry...");
  const srArtifact = readArtifact("SentinelRegistry");
  const SentinelRegistry = new ethers.ContractFactory(srArtifact.abi, srArtifact.bytecode, wallet);
  const sentinelRegistry = await SentinelRegistry.deploy();
  await sentinelRegistry.waitForDeployment();
  const sentinelRegistryAddress = await sentinelRegistry.getAddress();
  console.log("SentinelRegistry deployed to:", sentinelRegistryAddress);

  // 2. Deploy ProtocolGuard
  console.log("\nDeploying ProtocolGuard...");
  const pgArtifact = readArtifact("ProtocolGuard");
  const ProtocolGuard = new ethers.ContractFactory(pgArtifact.abi, pgArtifact.bytecode, wallet);
  const protocolGuard = await ProtocolGuard.deploy(sentinelRegistryAddress);
  await protocolGuard.waitForDeployment();
  const protocolGuardAddress = await protocolGuard.getAddress();
  console.log("ProtocolGuard deployed to:", protocolGuardAddress);

  // 3. Deploy VulnerableVault
  console.log("\nDeploying VulnerableVault (demo)...");
  const vvArtifact = readArtifact("VulnerableVault");
  const VulnerableVault = new ethers.ContractFactory(vvArtifact.abi, vvArtifact.bytecode, wallet);
  const vulnerableVault = await VulnerableVault.deploy();
  await vulnerableVault.waitForDeployment();
  const vulnerableVaultAddress = await vulnerableVault.getAddress();
  console.log("VulnerableVault deployed to:", vulnerableVaultAddress);

  // 4. Configure: Set ProtocolGuard in SentinelRegistry
  console.log("\nConfiguring contracts...");
  let tx = await sentinelRegistry.setProtocolGuard(protocolGuardAddress);
  await tx.wait();
  console.log("  SentinelRegistry.protocolGuard set to ProtocolGuard");

  // 5. Register VulnerableVault in ProtocolGuard
  tx = await protocolGuard.registerProtocol(
    vulnerableVaultAddress,
    "VulnerableVault (Demo)",
    7
  );
  await tx.wait();
  console.log("  VulnerableVault registered in ProtocolGuard (min threat: 7)");

  // 6. Mint initial Sentinel
  console.log("\nMinting initial Sentinel agent...");
  tx = await sentinelRegistry.mintSentinel(
    "Alpha Sentinel",
    "0g-storage://sentinel-alpha-metadata"
  );
  await tx.wait();
  console.log("  Sentinel #1 'Alpha Sentinel' minted");

  // 7. Assign Sentinel to VulnerableVault
  tx = await protocolGuard.assignSentinel(vulnerableVaultAddress, 1);
  await tx.wait();
  console.log("  Sentinel #1 assigned to guard VulnerableVault");

  // 8. Authorize ProtocolGuard as operator for Sentinel #1
  tx = await sentinelRegistry.setOperator(1, protocolGuardAddress, true);
  await tx.wait();
  console.log("  ProtocolGuard authorized as operator for Sentinel #1");

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("DEPLOYMENT COMPLETE — Hashly on 0G Galileo Testnet");
  console.log("=".repeat(60));
  console.log(`  SentinelRegistry:  ${sentinelRegistryAddress}`);
  console.log(`  ProtocolGuard:     ${protocolGuardAddress}`);
  console.log(`  VulnerableVault:   ${vulnerableVaultAddress}`);
  console.log("=".repeat(60));

  // Write deployment info
  const deployment = {
    network: "0g-galileo-testnet",
    chainId: 16602,
    timestamp: new Date().toISOString(),
    deployer: wallet.address,
    contracts: {
      SentinelRegistry: sentinelRegistryAddress,
      ProtocolGuard: protocolGuardAddress,
      VulnerableVault: vulnerableVaultAddress,
    }
  };
  fs.writeFileSync("./deployment.json", JSON.stringify(deployment, null, 2));
  console.log("\nDeployment info written to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

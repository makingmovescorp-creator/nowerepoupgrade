const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying PulseXFeeWrapper...");

  // PulseChain mainnet addresses
  const PULSEX_ROUTER = "0x98bf93ebf5c380C0e6Ae8e192A7e2AE08aF523224";
  const TREASURY_ADDRESS = "0xf9E66a8053A4F2E99bD5FDE36415D1E8BB178a47";

  // Get the contract factory
  const PulseXFeeWrapper = await ethers.getContractFactory("PulseXFeeWrapper");

  console.log("📋 Deployment parameters:");
  console.log(`   Router: ${PULSEX_ROUTER}`);
  console.log(`   Treasury: ${TREASURY_ADDRESS}`);
  console.log(`   Fee: 0.01% (1 basis point)`);

  // Deploy the contract
  const wrapper = await PulseXFeeWrapper.deploy(PULSEX_ROUTER, TREASURY_ADDRESS);

  console.log("⏳ Waiting for deployment...");
  await wrapper.waitForDeployment();

  const wrapperAddress = await wrapper.getAddress();

  console.log("✅ PulseXFeeWrapper deployed successfully!");
  console.log(`📍 Contract address: ${wrapperAddress}`);
  console.log(`🔗 View on PulseScan: https://scan.pulsechain.com/address/${wrapperAddress}`);

  // Verify deployment by checking treasury address
  const treasury = await wrapper.treasury();
  console.log(`💰 Treasury address: ${treasury}`);

  const feeBps = await wrapper.feeBps();
  console.log(`📊 Fee: ${feeBps} basis points (0.01%)`);

  // Save to .env.local for easy copying
  console.log("\n📝 Add this to your .env.local:");
  console.log(`NEXT_PUBLIC_WRAPPER_ADDRESS=${wrapperAddress}`);

  return wrapperAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import * as dotenv from "dotenv";
dotenv.config();

const RAW_KEY = (process.env.PRIVATE_KEY || "").trim();
const VALID_KEY = /^0x[0-9a-fA-F]{64}$/.test(RAW_KEY) ? RAW_KEY : undefined;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },

  // ⬇️ TU dodajemy
  paths: {
    sources: "contracts",
    tests: "test",
    cache: "cache",
    artifacts: "artifacts",
  },

  networks: {
    hardhat: { type: "edr-simulated" },
    pulseFork: {
      type: "edr-simulated",
      forking: { url: process.env.PULSECHAIN_RPC_URL || "https://rpc.pulsechain.com" },
    },
    ...(VALID_KEY
      ? {
          pulse: {
            type: "http",
            url: process.env.PULSECHAIN_RPC_URL || "https://rpc.pulsechain.com",
            chainId: 369,
            accounts: [VALID_KEY],
          },
        }
      : {}),
  },
};

export default config;

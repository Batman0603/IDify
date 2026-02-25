import * as dotenv from "dotenv";

dotenv.config();

export const ENV = {
  sepoliaRpc: process.env.SEPOLIA_RPC_URL,
  contractAddress: process.env.CONTRACT_ADDRESS,
  amdProverUrl: process.env.AMD_PROVER_URL,
};

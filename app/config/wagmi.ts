import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { pulsechain } from "@/lib/chains/pulsechain";

export const config = getDefaultConfig({
  appName: "EVM-dex | swap | liquidity | vault",
  // projectId: 'YOUR_PROJECT_ID',
  projectId: "51a8a52bcc0730097ea92eed587f88cb",
  chains: [pulsechain],
  ssr: true,
});

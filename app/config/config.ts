import { http, createConfig } from '@wagmi/core'
import { pulsechain } from '@/lib/chains/pulsechain'

export const configMy = createConfig({
  chains: [pulsechain],
  transports: {
    [pulsechain.id]: http('https://rpc.pulsechain.com'),
  },
})
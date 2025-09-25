export const FEATURED_PAIRS = [
  { key: 'plsx-wpls', label: 'PLSX / WPLS', pool: '0x1b45b9148791d3a104184Cd5DFE5CE57193a3ee9' as `0x${string}`, tvSymbol: 'PULSEX:PLSXDAI_B2893C.USD' },
  { key: 'wpls-usdc', label: 'WPLS / USDC', pool: '0x6753560538ECa67617A9Ce605178F788bE7E524E' as `0x${string}`, tvSymbol: 'PULSEX:WPLSUSDC_644445.USD' },
  { key: 'weth-wpls', label: 'WETH / WPLS', pool: '0x29d66d5900eb0d629e1e6946195520065a6c5aee' as `0x${string}`, tvSymbol: 'PULSEX2:WETHWPLS_29D66D.USD' },
  { key: 'hex-wpls',  label: 'HEX / WPLS',  pool: '0x19bb45a7270177e303dee6eaa6f5ad700812ba98' as `0x${string}`, tvSymbol: 'HEXWPLS_F1F4EE.USD' },
  { key: 'pdai-wpls',  label: 'pDAI / WPLS',  pool: '0xae8429918fdbf9a5867e3243697637dc56aa76a1' as `0x${string}`, tvSymbol: 'DAIUSDC_2DB5EF.USD' },
  { key: 'pwbtc-wpls', label: 'pWBTC / WPLS', pool: '0x46E27Ea3A035FfC9e6d6D56702CE3D208FF1e58c' as `0x${string}`, tvSymbol: 'WBTCDAI_78D582.USD' },
  { key: 'inc-wpls',   label: 'INC / WPLS',   pool: '0xf808bb6265e9ca27002c0a04562bf50d4fe37eaa' as `0x${string}`, tvSymbol: 'INCWPLS_F808BB.USD' },
  { key: 'ehex-wpls',  label: 'eHEX / WPLS',  pool: '0xF0eA3efE42C11c8819948Ec2D3179F4084863D3F' as `0x${string}`, tvSymbol: 'PULSEX:HEXWPLS_AA1EA1.USD' },
] as const;
export type FeaturedKey = typeof FEATURED_PAIRS[number]['key'];



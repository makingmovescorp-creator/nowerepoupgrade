export const FEATURED_PAIRS = [
  { key: 'plsx-wpls', label: 'PLSX / WPLS', pool: '0x149b2c629e652f2e89e11cd57e5d4d77ee166f9f' as `0x${string}`, tvSymbol: 'PLSXWPLS_95BED9.USD' },
  { key: 'weth-wpls', label: 'WETH / WPLS', pool: '0x29d66d5900eb0d629e1e6946195520065a6c5aee' as `0x${string}`, tvSymbol: 'ETHWPLS_77E4E3.USD' },
  { key: 'hex-wpls',  label: 'HEX / WPLS',  pool: '0x19bb45a7270177e303dee6eaa6f5ad700812ba98' as `0x${string}`, tvSymbol: 'HEXWPLS_F1F4EE.USD' },
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
  { key: 'pdai-wpls',  label: 'pDAI / WPLS',  pool: '0xae8429918fdbf9a5867e3243697637dc56aa76a1' as `0x${string}`, tvSymbol: 'DAIUSDC_2DB5EF.USD' },
  { key: 'pwbtc-wpls', label: 'pWBTC / WPLS', pool: '0x46E27Ea3A035FfC9e6d6D56702CE3D208FF1e58c' as `0x${string}`, tvSymbol: 'WBTCDAI_78D582.USD' },
>>>>>>> Stashed changes
=======
  { key: 'pdai-wpls',  label: 'pDAI / WPLS',  pool: '0xae8429918fdbf9a5867e3243697637dc56aa76a1' as `0x${string}`, tvSymbol: 'DAIUSDC_2DB5EF.USD' },
  { key: 'pwbtc-wpls', label: 'pWBTC / WPLS', pool: '0x46E27Ea3A035FfC9e6d6D56702CE3D208FF1e58c' as `0x${string}`, tvSymbol: 'WBTCDAI_78D582.USD' },
>>>>>>> Stashed changes
=======
  { key: 'pdai-wpls',  label: 'pDAI / WPLS',  pool: '0xae8429918fdbf9a5867e3243697637dc56aa76a1' as `0x${string}`, tvSymbol: 'DAIUSDC_2DB5EF.USD' },
  { key: 'pwbtc-wpls', label: 'pWBTC / WPLS', pool: '0x46E27Ea3A035FfC9e6d6D56702CE3D208FF1e58c' as `0x${string}`, tvSymbol: 'WBTCDAI_78D582.USD' },
>>>>>>> Stashed changes
] as const;
export type FeaturedKey = typeof FEATURED_PAIRS[number]['key'];



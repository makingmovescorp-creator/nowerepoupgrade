const WPLS_ADDRESS = process.env.NEXT_PUBLIC_WPLS || "0x0000000000000000000000000000000000000000";

export const TOKEN_LIST = [
    { name: "Pulse", symbol: "PLS", isNative: true,  address: "0x0000000000000000000000000000000000000000", decimal: 18, balance : 0 },
    { name: "Wrapped Pulse", symbol: "WPLS", isNative: false, address: WPLS_ADDRESS, decimal: 18, balance : 0 },
    { name: "PulseX", symbol: "PLSX", isNative: false, address: "0x95B303987A60C71504D99Aa1b13B4DA07b0790ab", decimal: 18, balance : 0 },
    { name: "Wrapped Ethereum", symbol: "WETH", isNative: false, address: "0x15D38573d2feeb82e7ad5187ab8c1d52a3cc3778", decimal: 18, balance : 0 },
    { name: "HEX", symbol: "HEX", isNative: false, address: "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39", decimal: 8, balance : 0 },
    { name: "Pulse Dai", symbol: "pDAI", isNative: false, address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimal: 18, balance : 0 },
    { name: "Pulse USD Coin", symbol: "pUSDC", isNative: false, address: "0xA0b86a33E6441b8c4C8C0E4A8c0e4A8c0e4A8c0e", decimal: 6, balance : 0 },
    { name: "Pulse Bitcoin", symbol: "pWBTC", isNative: false, address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", decimal: 8, balance : 0 },
]

export const PLS = TOKEN_LIST[0];
export const WPLS = TOKEN_LIST[1];

// Backwards-compatible aliases so existing imports still work
export const CRO = PLS;
export const CROGINAL = WPLS;
export const NATIVE_TOKEN = TOKEN_LIST[0];
export const WCRO = TOKEN_LIST[1];

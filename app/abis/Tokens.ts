const WPLS_ADDRESS = process.env.NEXT_PUBLIC_WPLS || "0x0000000000000000000000000000000000000000";

export const TOKEN_LIST = [
    { name: "Pulse", symbol: "PLS", isNative: true,  address: "0x0000000000000000000000000000000000000000", decimal: 18, balance : 0 },
    { name: "Wrapped Pulse", symbol: "WPLS", isNative: false, address: WPLS_ADDRESS, decimal: 18, balance : 0 },
]

export const PLS = TOKEN_LIST[0];
export const WPLS = TOKEN_LIST[1];

// Backwards-compatible aliases so existing imports still work
export const CRO = PLS;
export const CROGINAL = WPLS;
export const NATIVE_TOKEN = TOKEN_LIST[0];
export const WCRO = TOKEN_LIST[1];

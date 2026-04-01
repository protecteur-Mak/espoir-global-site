export const NOWPAYMENTS_API_KEY =
  process.env.NOWPAYMENTS_API_KEY || "K6854C2-VX0M4EC-JDD5GBH-P8K2TR7";

export const MIN_TOPUP_USDT = 15;

export const COINS = {
  usdttrc20: {
    code: "usdttrc20",
    title: "USDT (TRC20)",
    logo: "/icons/usdt-trc20.svg",
    recommended: true,
  },
  btc: {
    code: "btc",
    title: "Bitcoin (BTC)",
    logo: "/icons/btc.svg",
  },
  eth: {
    code: "eth",
    title: "Ethereum (ETH)",
    logo: "/icons/eth.svg",
  },
};

export interface AssetConfig {
    name: string;
    symbol: string;
    contractAddress?: string;
    priceFeedAddress: string;
    priceFeedDecimals: number;
    tokenDecimals: number;
    type: "native" | "wrapped" | "stablecoin" | "utility";
    description: string;
    logo: string;
}

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

export interface AllocationState {
    sliderValues: number[];      // 0-100 percentage values from sliders
    effectiveValues: number[];   // Actual effective percentages considering limits
    totalAllocated: number;      // Total USD allocated
    isComplete: boolean;         // Whether allocation reaches target
}


// Provider Configuration
export interface ProviderConfig {
    chainId: number;
    rpcUrl?: string;
    contractAddress: string;
    supportedAssets: AssetConfig[];
}

export interface TokenPrices {
    ethUsd: bigint;
    wbtcUsd: bigint;
    daiUsd: bigint;
    usdcUsd: bigint;
    linkUsd: bigint;
    wstethUsd: bigint;
}


// Service Interfaces
export interface PriceService {
    getPrices(): Promise<TokenPrices>;
}

export interface TokenBalances {
    eth: bigint;
    wbtc: bigint;
    dai: bigint;
    usdc: bigint;
    link: bigint;
    wsteth: bigint;
}

export interface BalanceService {
    getBalances(address: string): Promise<TokenBalances>;
}

export interface AssetDataService extends PriceService, BalanceService {}

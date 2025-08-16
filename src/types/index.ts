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

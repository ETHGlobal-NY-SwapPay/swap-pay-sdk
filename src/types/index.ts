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

// Enhanced Purchase Types
export interface PurchaseItem {
    asset: AssetConfig;
    allocation: {
        usdAmount: number;           // Human readable USD amount
        usdAmountBig: bigint;        // USD amount with 8 decimals precision
        tokenAmount: number;         // Human readable token amount  
        tokenAmountBig: bigint;      // Token amount in smallest unit (wei, etc.)
        effectivePercentage: number; // Actual percentage used
        sliderPercentage: number;    // Original slider value
    };
    pricing: {
        currentPrice: number;        // Human readable price
        currentPriceBig: bigint;     // Price with feed decimals precision
    };
}

export interface FeeCalculation {
    enabled: boolean;
    rateBps: number;              // basis points (5 = 0.05%)
    tokenSymbol: string;          // "ETH" for fee payment
    amountUsd: number;            // Human readable fee in USD
    amountUsdBig: bigint;         // Fee in USD with 8 decimals precision
    amountToken: number;          // Human readable fee in payment token
    amountTokenBig: bigint;       // Fee in payment token smallest unit
}

export interface PurchasePayload {
    allocation: AllocationState;
    targetAmount: number;
    totalAllocated: number;
    totalAllocatedBig: bigint;       // With 8 decimals precision
    items: PurchaseItem[];
    network: {
        chainId: number;
    };
    fee?: FeeCalculation;
    timestamp: number;               // When the calculation was made
}

export interface FeeConfig {
    enabled: boolean;
    rateBps: number;              // basis points (5 = 0.05%)
    tokenSymbol: string;          // "ETH" for fee payment
}

// Re-export transaction types
export type {
    BatchCall,
    TargetContract,
    SwapExecuteParams,
    SwapExecutionResult,
} from './transaction';

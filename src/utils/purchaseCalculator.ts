import type {
    AllocationState,
    AssetConfig,
    PurchaseItem,
    PurchasePayload,
    TokenPrices,
    FeeCalculation,
    FeeConfig
} from '../types';

export class PurchaseCalculator {
    private static readonly PRICE_DECIMALS = 8; // Chainlink USD feeds
    private static readonly USD_DECIMALS = 8; // USD amounts with 8 decimals precision
    private static readonly BPS_DENOM = 10_000n; // 100% in basis points

    /**
     * Calculates detailed purchase items from allocation state
     */
    static calculatePurchaseItems(
        allocation: AllocationState,
        assets: AssetConfig[],
        prices: TokenPrices,
        tokenLimits: number[] // USD limits per token
    ): PurchaseItem[] {
        const items: PurchaseItem[] = [];

        for (let i = 0; i < assets.length; i++) {
            const asset = assets[i];
            const effectivePercentage = allocation.effectiveValues[i];
            const sliderPercentage = allocation.sliderValues[i];

            // Skip if no allocation
            if (effectivePercentage <= 0) continue;

            // Get price for this asset
            const priceKey = `${asset.symbol.toLowerCase()}Usd` as keyof TokenPrices;
            const currentPriceBig = prices[priceKey] ?? 0n;
            const currentPrice = Number(currentPriceBig) / Math.pow(10, this.PRICE_DECIMALS);

            // Calculate USD allocation
            const usdAmount = (effectivePercentage / 100) * tokenLimits[i];
            const usdAmountBig = BigInt(Math.round(usdAmount * Math.pow(10, this.USD_DECIMALS)));

            // Calculate token amount
            let tokenAmountBig = 0n;
            let tokenAmount = 0;
            
            if (currentPriceBig > 0n) {
                tokenAmountBig = (usdAmountBig * this.pow10(asset.tokenDecimals)) / currentPriceBig;
                tokenAmount = Number(tokenAmountBig) / Math.pow(10, asset.tokenDecimals);
            }

            items.push({
                asset,
                allocation: {
                    usdAmount,
                    usdAmountBig,
                    tokenAmount,
                    tokenAmountBig,
                    effectivePercentage,
                    sliderPercentage
                },
                pricing: {
                    currentPrice,
                    currentPriceBig
                }
            });
        }

        return items;
    }

    /**
     * Calculates fee based on total allocation
     */
    static calculateFee(
        totalAllocatedBig: bigint,
        feeConfig: FeeConfig,
        ethPriceBig: bigint
    ): FeeCalculation | undefined {
        if (!feeConfig.enabled) return undefined;

        const rateBps = BigInt(feeConfig.rateBps);
        const amountUsdBig = (totalAllocatedBig * rateBps) / this.BPS_DENOM;
        const amountUsd = Number(amountUsdBig) / Math.pow(10, this.USD_DECIMALS);

        let amountTokenBig = 0n;
        let amountToken = 0;

        if (feeConfig.tokenSymbol === 'ETH' && ethPriceBig > 0n) {
            // Calculate ETH amount for fee (18 decimals)
            amountTokenBig = (amountUsdBig * this.pow10(18)) / ethPriceBig;
            amountToken = Number(amountTokenBig) / Math.pow(10, 18);
        }

        return {
            enabled: feeConfig.enabled,
            rateBps: feeConfig.rateBps,
            tokenSymbol: feeConfig.tokenSymbol,
            amountUsd,
            amountUsdBig,
            amountToken,
            amountTokenBig
        };
    }

    /**
     * Creates complete purchase payload
     */
    static createPurchasePayload(
        allocation: AllocationState,
        assets: AssetConfig[],
        prices: TokenPrices,
        tokenLimits: number[],
        targetAmount: number,
        chainId: number,
        feeConfig?: FeeConfig
    ): PurchasePayload {
        const items = this.calculatePurchaseItems(allocation, assets, prices, tokenLimits);
        const totalAllocatedBig = BigInt(Math.round(allocation.totalAllocated * Math.pow(10, this.USD_DECIMALS)));
        
        let fee: FeeCalculation | undefined;
        if (feeConfig?.enabled) {
            const ethPriceBig = prices.ethUsd ?? 0n;
            fee = this.calculateFee(totalAllocatedBig, feeConfig, ethPriceBig);
        }

        return {
            allocation,
            targetAmount,
            totalAllocated: allocation.totalAllocated,
            totalAllocatedBig,
            items,
            network: {
                chainId
            },
            fee,
            timestamp: Date.now()
        };
    }

    /**
     * Utility function to create BigInt for 10^n
     */
    private static pow10(decimals: number): bigint {
        return BigInt(10) ** BigInt(decimals);
    }

    /**
     * Formats purchase payload for blockchain transaction
     */
    static formatForBlockchain(payload: PurchasePayload) {
        return {
            totalUsdBig: payload.totalAllocatedBig,
            items: payload.items.map(item => ({
                name: item.asset.symbol,
                contractAddress: item.asset.contractAddress ?? null,
                tokenDecimals: item.asset.tokenDecimals,
                priceFeedDecimals: item.asset.priceFeedDecimals,
                priceBig: item.pricing.currentPriceBig,
                amountUsdBig: item.allocation.usdAmountBig,
                amountTokenBig: item.allocation.tokenAmountBig,
                debug: {
                    priceUsd: item.pricing.currentPrice,
                    amountUsd: item.allocation.usdAmount,
                    amountToken: item.allocation.tokenAmount
                }
            })),
            fee: payload.fee ? {
                rateBps: payload.fee.rateBps,
                feeUsdBig: payload.fee.amountUsdBig,
                feeTokenBig: payload.fee.amountTokenBig,
                feeToken: payload.fee.amountToken
            } : undefined
        };
    }
}

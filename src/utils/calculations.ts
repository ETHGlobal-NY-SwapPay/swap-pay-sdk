import type {AssetConfig, TokenBalances, TokenPrices} from '../types';
import {formatBalance, formatPrice} from './formatters';

export interface AllocationCalculationResult {
    tokenLimitsUsd: number[];
    totalAllocated: number;
    isComplete: boolean;
    effectiveValues: number[];
}

export function calculateAllocation(
    sliderValues: number[],
    assets: AssetConfig[],
    prices: TokenPrices | null,
    balances: TokenBalances | null = null,
    targetAmount = 10000,
    tolerance = 0 // Zero tolerance for exact validation
): AllocationCalculationResult {
    if (!prices) {
        return {
            tokenLimitsUsd: assets.map(() => 0),
            totalAllocated: 0,
            isComplete: false,
            effectiveValues: assets.map(() => 0),
        };
    }

    // Calculate token limits in USD based on wallet balances
    const tokenLimitsUsd = assets.map((asset) => {
        if (!balances) {
            // If no wallet connected, assume unlimited (return a high number)
            return targetAmount * 10; // Allow much more than target for flexibility
        }

        const balanceKey = asset.symbol.toLowerCase() as keyof TokenBalances;
        const priceKey = `${asset.symbol.toLowerCase()}Usd` as keyof TokenPrices;

        const balanceRaw = balances[balanceKey] ?? 0n;
        const priceRaw = prices[priceKey] ?? 0n;

        const balanceToken = formatBalance(balanceRaw, asset.tokenDecimals);
        const priceUsd = formatPrice(priceRaw, asset.priceFeedDecimals);

        return balanceToken * priceUsd;
    });

    // Calculate effective allocation considering limits and constraints
    const effectiveValues = [...sliderValues];
    let totalAllocated = 0;

    // Apply constraints based on available balances
    for (let i = 0; i < sliderValues.length; i++) {
        const requestedUsd = (sliderValues[i] / 100) * targetAmount;
        const maxAvailableUsd = tokenLimitsUsd[i];

        // Limit by available balance
        const constrainedUsd = Math.min(requestedUsd, maxAvailableUsd);

        // Convert back to percentage
        const constrainedPercentage = targetAmount > 0 ? (constrainedUsd / targetAmount) * 100 : 0;
        effectiveValues[i] = Math.min(sliderValues[i], constrainedPercentage);

        totalAllocated += constrainedUsd;
    }

    // Check if allocation is complete (within tolerance)
    const isComplete = Math.abs(totalAllocated - targetAmount) <= tolerance;

    return {
        tokenLimitsUsd,
        totalAllocated,
        isComplete,
        effectiveValues,
    };
}

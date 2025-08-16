import {formatUnits} from 'viem';

export function formatCurrency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
}

export function formatPrice(price: bigint, decimals = 8): number {
    return Number(formatUnits(price, decimals));
}

export function formatBalance(balance: bigint, decimals = 18): number {
    return Number(formatUnits(balance, decimals));
}

export function formatTokenBalance(balance: number, symbol: string): string {
    if (balance === 0) return `0 ${symbol}`;

    // For very small amounts, show more decimals
    if (balance < 0.001) {
        return `${balance.toFixed(8)} ${symbol}`;
    }
    // For small amounts, show 6 decimals
    if (balance < 1) {
        return `${balance.toFixed(6)} ${symbol}`;
    }
    // For larger amounts, show 2-4 decimals
    if (balance < 1000) {
        return `${balance.toFixed(4)} ${symbol}`;
    }
    // For very large amounts, show 2 decimals
    return `${balance.toFixed(2)} ${symbol}`;
}

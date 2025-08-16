import React, {useState} from 'react';
import type {
    AssetConfig,
    AssetDataService,
    AllocationState
} from '@/types';
import {usePrices} from '../hooks/prices';
import {useBalances} from '../hooks/balances';
import {calculateAllocation} from '../utils/calculations';
import {formatCurrency, formatBalance, formatTokenBalance, formatPrice} from '../utils/formatters';
import type {Wallet} from "@/types/wallet.ts";
import {ChainlinkAssetService} from '../services/ChainlinkAssetService';
import {SEPOLIA_ASSETS, SEPOLIA_CONFIG} from '../config';

export interface AssetsProps {
    service?: AssetDataService;
    assets?: AssetConfig[];
    wallet?: Wallet;
    targetAmount?: number;
    className?: string;
    onAllocationChange?: (state: AllocationState) => void;
    onPurchase?: (allocation: AllocationState) => void;
}

const cardStyle: React.CSSProperties = {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    marginBottom: '12px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
};

const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '760px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
};

export function Assets({
                                    service: providedService,
                                    assets: providedAssets,
                                    wallet,
                                    targetAmount = 10000,
                                    onAllocationChange,
                                    onPurchase,
                                }: AssetsProps) {

    const TOTAL = targetAmount; // Use targetAmount as TOTAL
    const TOL = 0.01; // 0.01 tolerance like original
    const EPS = 1e-6; // Small epsilon for floating point comparisons

    const service = React.useMemo(() =>
        providedService || new ChainlinkAssetService(SEPOLIA_CONFIG),
        [providedService]
    );
    const assets = providedAssets || SEPOLIA_ASSETS;

    const [values, setValues] = useState<number[]>(new Array(assets.length).fill(0)); // slider values
    const [effective, setEffective] = useState<number[]>(new Array(assets.length).fill(0)); // effective percentages
    const [activeSliderIndex, setActiveSliderIndex] = useState<number | null>(null);

    // Use separate hooks for prices and balances
    const {prices, error: priceError} = usePrices(service, 5000);
    const {balances, error: balanceError} = useBalances(service, wallet || {isConnected: false, address: '', chainId: 0});

    const error = priceError || balanceError;

    // Calculate token limits in USD
    const tokenLimits = React.useMemo(() => {
        if (!balances || !prices) return assets.map(() => 0);

        return assets.map((asset) => {
            const balanceKey = asset.symbol.toLowerCase() as keyof typeof balances;
            const priceKey = `${asset.symbol.toLowerCase()}Usd` as keyof typeof prices;

            const balanceRaw = balances[balanceKey] ?? 0n;
            const priceRaw = prices[priceKey] ?? 0n;

            const balanceToken = formatBalance(balanceRaw, asset.tokenDecimals);
            const priceUsd = formatPrice(priceRaw, asset.priceFeedDecimals);

            return balanceToken * priceUsd;
        });
    }, [balances, prices, assets]);

    // Total allocated USD
    const totalAllocated = React.useMemo(() => {
        const total = effective.reduce((acc, pct, i) => acc + (pct / 100) * tokenLimits[i], 0);
        console.log('Total calculation:', {
            effective,
            tokenLimits,
            breakdown: effective.map((pct, i) => ({
                asset: assets[i].symbol,
                effective: pct,
                tokenLimit: tokenLimits[i],
                contribution: (pct / 100) * tokenLimits[i]
            })),
            total
        });
        return total;
    }, [effective, tokenLimits, assets]);

    // Global lock check
    const globallyLocked = !wallet?.isConnected;

    // Slider disabled logic
    const isSliderDisabled = (index: number) => {
        if (globallyLocked) return true;
        const reached = totalAllocated >= TOTAL - 0.01;
        return reached ? activeSliderIndex !== index : false;
    };

    // Check if target is reached
    const isTargetReached = Math.abs(totalAllocated - TOTAL) <= 0.01;

    // Handle slider change
    const handleSliderChange = (index: number, newValue: number) => {
        if (globallyLocked) return;
        if (totalAllocated >= TOTAL - TOL && newValue > values[index]) return;

        const sliders = [...values];
        sliders[index] = Math.max(0, Math.min(100, Math.round(newValue)));
        setValues(sliders);

        const othersUSD = effective.reduce(
            (acc, pct, i) => (i === index ? acc : acc + (pct / 100) * tokenLimits[i]),
            0
        );
        const missing = TOTAL - othersUSD;
        const denom = Math.max(1e-9, tokenLimits[index]);
        const pctMaxBySlider = sliders[index];
        const pctNeededExact = (missing / denom) * 100;
        let thisEffPct = Math.min(pctNeededExact, pctMaxBySlider, 100);
        if (missing <= EPS) thisEffPct = Math.min(effective[index], pctMaxBySlider);
        thisEffPct = Math.max(0, thisEffPct);

        const nextEff = [...effective];
        nextEff[index] = thisEffPct;
        setEffective(nextEff);

        const newTotal = othersUSD + (thisEffPct / 100) * denom;
        if (Math.abs(newTotal - TOTAL) <= 0.01) setActiveSliderIndex(index);
        else setActiveSliderIndex(null);

        // Call the callback with the updated state
        if (onAllocationChange) {
            const state: AllocationState = {
                sliderValues: sliders,
                effectiveValues: nextEff,
                totalAllocated: newTotal,
                isComplete: Math.abs(newTotal - TOTAL) <= 0.01
            };
            onAllocationChange(state);
        }
    };

    const handleReset = () => {
        setValues(new Array(assets.length).fill(0));
        setEffective(new Array(assets.length).fill(0));
        setActiveSliderIndex(null);
    };

    const handlePurchase = () => {
        if (onPurchase && isTargetReached && prices) {
            const state: AllocationState = {
                sliderValues: values,
                effectiveValues: effective,
                totalAllocated: totalAllocated,
                isComplete: isTargetReached
            };
            onPurchase(state);
        }
    };

    if (error) {
        return (
            <div style={containerStyle}>
                <div style={cardStyle}>
                    <p>Error loading asset data: {error.message}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            {/* Header */}
            <div style={{
                ...cardStyle,
                background: isTargetReached ? '#f0fdf4' : 'white', // Light green background when target reached
                border: isTargetReached ? '1px solid #22c55e' : '1px solid #e5e7eb'
            }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                    <h1 style={{
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: '600',
                        color: isTargetReached ? '#16a34a' : 'inherit'
                    }}>
                        Portfolio Allocation {isTargetReached && '✓'}
                    </h1>
                    <span style={{fontSize: '14px', color: '#6b7280'}}>
                        {isTargetReached ? 'Target Reached!' : `Adjust the sliders to reach ${formatCurrency(targetAmount)}`}
                    </span>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                    <div style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: isTargetReached ? '#16a34a' : 'inherit'
                    }}>
                        {formatCurrency(totalAllocated)}
                        <span style={{
                            fontSize: '16px',
                            color: isTargetReached ? '#16a34a' : '#6b7280',
                            marginLeft: '8px'
                        }}>
                            / {formatCurrency(targetAmount)}
                        </span>
                    </div>
                    <div style={{display: 'flex', gap: '8px'}}>
                        <button
                            onClick={handleReset}
                            style={{
                                padding: '8px 16px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                background: 'white',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Reset
                        </button>
                        <button
                            onClick={handlePurchase}
                            disabled={!isTargetReached}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '6px',
                                background: isTargetReached ? '#16a34a' : '#d1d5db',
                                color: isTargetReached ? 'white' : '#6b7280',
                                cursor: isTargetReached ? 'pointer' : 'not-allowed',
                                fontSize: '14px'
                            }}
                        >
                            Purchase
                        </button>
                    </div>
                </div>

                {/* Progress bar */}
                <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#f3f4f6',
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${Math.min(100, (totalAllocated / targetAmount) * 100)}%`,
                        height: '100%',
                        background: isTargetReached ? '#22c55e' : '#111827',
                        transition: 'width 0.3s ease'
                    }} />
                </div>

                {isTargetReached && (
                    <div style={{
                        marginTop: '12px',
                        padding: '8px 12px',
                        background: '#dcfce7',
                        border: '1px solid #22c55e',
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: '#16a34a'
                    }}>
                        🎯 Target reached exactly! You can only decrease or modify existing allocations.
                    </div>
                )}
            </div>

            {/* Asset List */}
            <div style={cardStyle}>
                {assets.map((asset, index) => {
                    const priceKey = `${asset.symbol.toLowerCase()}Usd` as keyof typeof prices;
                    const price = prices ? Number(prices[priceKey]) / Math.pow(10, asset.priceFeedDecimals) : 0;

                    // Get available balance for this asset
                    const balanceKey = asset.symbol.toLowerCase() as keyof typeof balances;
                    const availableBalance = balances && prices ?
                        formatBalance(balances[balanceKey] ?? 0n, asset.tokenDecimals) : 0;
                    const availableBalanceUsd = availableBalance * price;

                    const allocationAmount = (effective[index] / 100) * tokenLimits[index];

                    // Debug logging for this asset
                    if (effective[index] > 0) {
                        console.log(`Asset ${asset.symbol}:`, {
                            sliderValue: values[index],
                            effectivePercent: effective[index],
                            tokenLimit: tokenLimits[index],
                            calculatedAmount: allocationAmount,
                            price: price
                        });
                    }
                    // Check if asset has zero available balance
                    const hasZeroBalance = availableBalance === 0;

                    // Check if this asset contributes to reaching the target
                    const contributesToTarget = values[index] > 0 && isTargetReached;
                    const sliderDisabled = isSliderDisabled(index);

                    return (
                        <div key={asset.symbol} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '16px 0',
                            borderBottom: index < assets.length - 1 ? '1px solid #f3f4f6' : 'none',
                            background: contributesToTarget ? '#f0fdf4' : 'transparent',
                            borderRadius: contributesToTarget ? '6px' : '0',
                            paddingLeft: contributesToTarget ? '12px' : '0',
                            paddingRight: contributesToTarget ? '12px' : '0'
                        }}>
                            {/* Asset Info */}
                            <div style={{display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px'}}>
                                <img
                                    src={asset.logo}
                                    alt={asset.name}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%'
                                    }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/40x40?text=${asset.symbol}`;
                                    }}
                                />
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '2px'
                                    }}>
                                        <span style={{
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            color: contributesToTarget ? '#16a34a' : 'inherit'
                                        }}>
                                            {asset.name} {contributesToTarget && '✓'}
                                        </span>
                                        <span style={{
                                            fontSize: '12px',
                                            color: '#6b7280',
                                            fontWeight: '500'
                                        }}>
                                            ${price.toFixed(2)}
                                        </span>
                                    </div>
                                    {wallet?.isConnected && balances && (
                                        <div>
                                            <div style={{fontSize: '11px', color: '#9ca3af'}}>
                                                Available: {formatTokenBalance(availableBalance, asset.symbol)}
                                                {availableBalanceUsd > 0 && (
                                                    <span style={{color: '#6b7280'}}> ({formatCurrency(availableBalanceUsd)})</span>
                                                )}
                                            </div>
                                            {values[index] > 0 && (
                                                <div style={{fontSize: '11px', color: '#ef4444', marginTop: '1px'}}>
                                                    Spent: {formatTokenBalance(allocationAmount / price, asset.symbol)} ({formatCurrency(allocationAmount)})
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {!wallet?.isConnected && (
                                        <div style={{fontSize: '11px', color: '#9ca3af'}}>
                                            Connect wallet to see balance
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Slider */}
                            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '4px'}}>
                                {/* Basic HTML Range Slider */}
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={values[index]}
                                    onChange={(e) => handleSliderChange(index, Number(e.target.value))}
                                    disabled={sliderDisabled}
                                    style={{
                                        width: '100%',
                                        margin: '0',
                                        opacity: sliderDisabled ? 0.5 : 1,
                                        cursor: sliderDisabled ? 'not-allowed' : 'pointer'
                                    }}
                                    title={
                                        !wallet?.isConnected ? 'Connect wallet to edit' :
                                        hasZeroBalance ? 'No balance available for this asset' :
                                        (isTargetReached && values[index] === 0) ?
                                        'Cannot add more assets - target reached exactly' : ''
                                    }
                                />

                                {/* Labels below slider */}
                                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280'}}>
                                    <span>0%</span>
                                    <span>100%</span>
                                </div>
                            </div>

                            {/* Allocation Display */}
                            <div style={{textAlign: 'right', minWidth: '120px'}}>
                                <div style={{
                                    fontWeight: '600',
                                    fontSize: '16px',
                                    color: contributesToTarget ? '#16a34a' : 'inherit'
                                }}>
                                    {formatCurrency(allocationAmount)}
                                </div>
                                <div style={{fontSize: '12px', color: '#6b7280'}}>
                                    Slider: {values[index].toFixed(1)}% • Effective: {effective[index].toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div style={{
                    textAlign: 'right',
                    marginTop: '16px',
                    fontSize: '12px',
                    color: '#6b7280'
                }}>
                    Based on Chainlink Data Feeds
                </div>
            </div>
        </div>
    );
}

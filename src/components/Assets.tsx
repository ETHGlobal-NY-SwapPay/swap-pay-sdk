import React, {useState} from 'react';
import type {
    AssetConfig,
    AssetDataService,
    AllocationState
} from '@/types';
import {usePrices} from '../hooks/prices';
import {useBalances} from '../hooks/balances';
import {calculateAllocation} from '../utils/calculations';
import {formatCurrency, formatBalance, formatTokenBalance} from '../utils/formatters';
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
    const service = React.useMemo(() =>
        providedService || new ChainlinkAssetService(SEPOLIA_CONFIG),
        [providedService]
    );
    const assets = providedAssets || SEPOLIA_ASSETS;
    const [allocations, setAllocations] = useState<number[]>(new Array(assets.length).fill(0));

    // Use separate hooks for prices and balances
    const {prices, error: priceError} = usePrices(service, 5000);
    const {balances, error: balanceError} = useBalances(service, wallet || {isConnected: false, address: '', chainId: 0});

    const error = priceError || balanceError;

    // Add custom CSS to hide default slider thumbs
    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .custom-slider::-webkit-slider-thumb {
                -webkit-appearance: none !important;
                appearance: none !important;
                width: 0 !important;
                height: 0 !important;
                background: transparent !important;
            }
            .custom-slider::-moz-range-thumb {
                border: none !important;
                width: 0 !important;
                height: 0 !important;
                background: transparent !important;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Calculate allocation limits and effective values
    const calculationResult = React.useMemo(() => {
        if (!prices) return null;

        return calculateAllocation(allocations, assets, prices, balances, targetAmount);
    }, [allocations, assets, prices, balances, targetAmount]);

    const totalAllocated = calculationResult?.totalAllocated || 0;
    const isComplete = calculationResult?.isComplete || false;
    const effectiveValues = calculationResult?.effectiveValues || allocations;

    // Check if target is reached (within $1 tolerance)
    const isTargetReached = Math.abs(totalAllocated - targetAmount) <= 1;

    const handleSliderChange = (index: number, value: number) => {
        // If target is reached and trying to increase allocation, prevent it
        if (isTargetReached && value > allocations[index]) {
            return; // Don't allow increasing allocation when target is reached
        }

        const newAllocations = [...allocations];
        newAllocations[index] = value;
        setAllocations(newAllocations);

        if (onAllocationChange && calculationResult) {
            const state: AllocationState = {
                sliderValues: newAllocations,
                effectiveValues: calculationResult.effectiveValues,
                totalAllocated: calculationResult.totalAllocated,
                isComplete: calculationResult.isComplete
            };
            onAllocationChange(state);
        }
    };

    const handleReset = () => {
        setAllocations(new Array(assets.length).fill(0));
    };

    const handlePurchase = () => {
        if (onPurchase && isComplete && prices) {
            const state: AllocationState = {
                sliderValues: allocations,
                effectiveValues: effectiveValues,
                totalAllocated: totalAllocated,
                isComplete: isComplete
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
                            disabled={!isComplete}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '6px',
                                background: isComplete ? (isTargetReached ? '#16a34a' : '#111827') : '#d1d5db',
                                color: isComplete ? 'white' : '#6b7280',
                                cursor: isComplete ? 'pointer' : 'not-allowed',
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
                        🎯 Target reached! You can only decrease or modify existing allocations.
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

                    const allocationAmount = (effectiveValues[index] / 100) * targetAmount;
                    const isSliderDisabled = !wallet?.isConnected;

                    // Check if this asset contributes to reaching the target
                    const contributesToTarget = allocations[index] > 0 && isTargetReached;

                    // Check if asset has zero available balance
                    const hasZeroBalance = availableBalance === 0;

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
                                            {allocations[index] > 0 && (
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
                            <div style={{flex: 1, display: 'flex', alignItems: 'center', gap: '16px'}}>
                                <span style={{fontSize: '12px', color: '#6b7280', minWidth: '30px'}}>0%</span>

                                {/* Custom Slider Container */}
                                <div style={{
                                    position: 'relative',
                                    flex: 1,
                                    height: '6px',
                                    background: '#e5e7eb',
                                    borderRadius: '3px',
                                    margin: '0 16px',
                                    opacity: isSliderDisabled ? 0.5 : 1
                                }}>
                                    {/* Progress Fill */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        height: '100%',
                                        width: `${allocations[index]}%`,
                                        background: hasZeroBalance ? '#d1d5db' :
                                            contributesToTarget ? '#22c55e' : '#111827',
                                        borderRadius: '3px',
                                        transition: 'width 0.2s ease'
                                    }} />

                                    {/* Actual Slider Input */}
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={allocations[index]}
                                        onChange={(e) => handleSliderChange(index, Number(e.target.value))}
                                        disabled={isSliderDisabled}
                                        className="custom-slider"
                                        style={{
                                            position: 'absolute',
                                            top: '-6px',
                                            left: 0,
                                            width: '100%',
                                            height: '18px',
                                            background: 'transparent',
                                            outline: 'none',
                                            WebkitAppearance: 'none',
                                            appearance: 'none',
                                            cursor: isSliderDisabled ? 'not-allowed' : 'pointer'
                                        }}
                                        title={isSliderDisabled ? 'Connect wallet to edit' :
                                            (isTargetReached && allocations[index] === 0) ? 'Cannot add more resources - target reached' : ''}
                                    />

                                    {/* Custom Slider Thumb */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '-6px',
                                        left: `calc(${allocations[index]}% - 9px)`,
                                        width: '18px',
                                        height: '18px',
                                        background: hasZeroBalance ? '#9ca3af' :
                                            contributesToTarget ? '#22c55e' : '#111827',
                                        borderRadius: '50%',
                                        border: '2px solid white',
                                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                                        pointerEvents: 'none',
                                        transition: 'left 0.2s ease'
                                    }} />
                                </div>

                                <span style={{fontSize: '12px', color: '#6b7280', minWidth: '40px'}}>100%</span>
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
                                    Slider: {allocations[index].toFixed(1)}% • Effective: {effectiveValues[index].toFixed(1)}%
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

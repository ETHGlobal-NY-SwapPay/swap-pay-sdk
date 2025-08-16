import React, { useState} from 'react';
import {SEPOLIA_ASSETS} from "@/config/assets.ts";
import type {AllocationState} from "@/types";

interface AssetsProps {
    targetAmount: number;
    onPurchase?: (allocation: AllocationState) => void;
}

const cardStyle: React.CSSProperties = {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    marginBottom: '12px',
    fontFamily: 'system-ui, sans-serif'
};

const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '760px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
};

const Assets = ({targetAmount = 1000}:AssetsProps) => {
    const assets = SEPOLIA_ASSETS;
    const [allocations, setAllocations] = useState<number[]>(
        new Array(assets.length).fill(0)
    );

    // Add custom CSS to hide default slider styling
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

    const handleSliderChange = (index: number, value: number) => {
        const newAllocations = [...allocations];
        newAllocations[index] = value;
        setAllocations(newAllocations);
    };

    const handleReset = () => {
        setAllocations(new Array(assets.length).fill(0));
    };

    const handlePurchase = () => {

    };

    const totalAllocated = allocations.reduce((sum, allocation) =>
        sum + (allocation / 100) * targetAmount, 0
    );

    const isTargetReached = Math.abs(totalAllocated - targetAmount) <= 1;
    const isSliderDisabled = false;

    return (
        <div style={containerStyle}>
            <div style={{
                ...cardStyle,
                background: isTargetReached ? '#f0fdf4' : 'white',
                border: isTargetReached ? '1px solid #22c55e' : '1px solid #e5e7eb'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: '18px',
                        color: isTargetReached ? '#16a34a' : 'inherit'
                    }}>
                        Portfolio Allocation {isTargetReached && '✓'}
                    </h1>

                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: isTargetReached ? '#16a34a' : 'inherit'
                    }}>
                        ${totalAllocated.toFixed(2)} / ${targetAmount.toLocaleString()}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
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
            </div>

            <div style={cardStyle}>
                {assets.map((asset, index) => {
                    const allocationAmount = (allocations[index] / 100) * targetAmount;

                    return (
                        <div key={asset.symbol} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '16px 0',
                            borderBottom: index < assets.length - 1 ? '1px solid #f3f4f6' : 'none'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px' }}>
                                <img
                                    src={asset.logo}
                                    alt={asset.name}
                                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                />
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>
                                        {asset.name}
                                    </div>
                                </div>
                            </div>

                            {/* Custom Slider */}
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '30px' }}>0%</span>

                                <div style={{
                                    position: 'relative',
                                    flex: 1,
                                    height: '6px',
                                    background: '#e5e7eb',
                                    borderRadius: '3px',
                                    opacity: isSliderDisabled ? 0.5 : 1
                                }}>
                                    <div style={{
                                        width: `${allocations[index]}%`,
                                        height: '100%',
                                        background: '#111827',
                                        borderRadius: '3px',
                                        transition: 'width 0.2s ease'
                                    }} />

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
                                            cursor: isSliderDisabled ? 'not-allowed' : 'pointer'
                                        }}
                                        title={isSliderDisabled ? 'Connect wallet to edit' : ''}
                                    />

                                    <div style={{
                                        position: 'absolute',
                                        top: '-6px',
                                        left: `calc(${allocations[index]}% - 9px)`,
                                        width: '18px',
                                        height: '18px',
                                        background: '#111827',
                                        borderRadius: '50%',
                                        border: '2px solid white',
                                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                                        pointerEvents: 'none',
                                        transition: 'left 0.2s ease'
                                    }} />
                                </div>

                                <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '40px' }}>100%</span>
                            </div>

                            <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                <div style={{ fontWeight: '600', fontSize: '16px' }}>
                                    ${allocationAmount.toFixed(2)}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    {allocations[index]}%
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Assets;

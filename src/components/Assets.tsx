import {SEPOLIA_ASSETS} from "@/config/assets.ts";
import {useState} from "react";
import {formatCurrency} from "@/utils/formatter.ts";

const cardStyle: React.CSSProperties = {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    marginBottom: '12px',
    fontFamily: 'system-ui, sans-serif'
};

export interface AssetsProps {
    targetAmount: number;
}

const Assets = ({targetAmount = 1000}:AssetsProps) => {
    const assets = SEPOLIA_ASSETS;
    const [allocations, setAllocations] = useState<number[]>(
        new Array(assets.length).fill(0)
    );

    const isTargetReached = true;

    const handleSliderChange = (index: number, value: number) => {
        const newAllocations = [...allocations];
        newAllocations[index] = value;
        setAllocations(newAllocations);
    };

    const totalAllocated = allocations.reduce((sum, allocation) =>
        sum + (allocation / 100) * targetAmount, 0
    );

    return (
        <div style={{maxWidth: '600px', margin: '0 auto'}}>
            {/* Header */}
            <div style={{
                ...cardStyle
            }}>
                <div style={{padding: '20px', fontFamily: 'Arial, sans-serif'}}>
                    <h1 style={{
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: '600',
                        color: isTargetReached ? '#16a34a' : 'inherit'
                    }}
                    >Portfolio Allocation</h1>
                    <span style={{fontSize: '14px', color: '#6b7280'}}>
                        {isTargetReached ? 'Target Reached!' : `Adjust the sliders to reach ${formatCurrency(targetAmount)}`}
                </span>
                </div>

                <div>
                    {formatCurrency(totalAllocated)}/{formatCurrency(targetAmount)}
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
                    }}/>
                </div>
            </div>

            {/* Asset List */}
            <div style={cardStyle}>
                {assets.map((asset, index) => (
                    <div key={asset.symbol} style={{
                        marginBottom: '16px',
                        padding: '12px 0',
                        borderBottom: index < assets.length - 1 ? '1px solid #f3f4f6' : 'none'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '8px'
                        }}>
                            <span style={{fontWeight: '600'}}>
                                {asset.name} ({asset.symbol})
                            </span>
                            <span>10</span>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={allocations[index]}
                            onChange={(e) => handleSliderChange(index, Number(e.target.value))}
                            style={{width: '100%', marginBottom: '8px'}}
                        />

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '14px',
                            color: '#666'
                        }}>
                            <span>{allocations[index]}%</span>
                            <span>${((allocations[index] / 100) * targetAmount).toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Assets;

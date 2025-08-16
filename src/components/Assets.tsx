import {SEPOLIA_ASSETS} from "@/config/assets.ts";
import {useState} from "react";

function formatCurrency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
}

export interface AssetsProps {
    targetAmount: number;
}

const Assets = ({targetAmount}:AssetsProps) => {
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
        <div>
            {/* Header */}
            <div>
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
            <div>
                {assets.map((asset, index) => (
                    <div key={asset.symbol} style={{
                        padding: '10px',
                        border: '1px solid #ccc',
                        marginBottom: '10px'
                    }}>
                        <div>{asset.name} ({asset.symbol}) - 10</div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={allocations[index]}
                            onChange={(e) => handleSliderChange(index, Number(e.target.value))}
                        />
                        <span>{allocations[index]}%</span>
                        <div>Amount: ${((allocations[index] / 100) * targetAmount).toFixed(2)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Assets;

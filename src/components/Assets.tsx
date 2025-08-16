function formatCurrency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
}

const Assets = () => {
    const totalAllocated = 0;
    const targetAmount = 0;
    const isTargetReached = true;

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
        </div>
    );
}

export default Assets;

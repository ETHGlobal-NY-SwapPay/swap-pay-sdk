import React from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {hasError: true, error};
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '20px',
                    margin: '20px',
                    border: '2px solid #ef4444',
                    borderRadius: '8px',
                    backgroundColor: '#fef2f2'
                }}>
                    <h1 style={{color: '#dc2626', marginBottom: '10px'}}>Something went wrong!</h1>
                    <details style={{marginTop: '10px'}}>
                        <summary style={{cursor: 'pointer', fontWeight: 'bold'}}>Error Details</summary>
                        <pre style={{
                            marginTop: '10px',
                            padding: '10px',
                            background: '#f5f5f5',
                            borderRadius: '4px',
                            fontSize: '12px',
                            overflow: 'auto'
                        }}>
                            {this.state.error?.stack || this.state.error?.toString()}
                        </pre>
                    </details>
                    <button
                        onClick={() => this.setState({hasError: false, error: undefined})}
                        style={{
                            marginTop: '10px',
                            padding: '8px 16px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

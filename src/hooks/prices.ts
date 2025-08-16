import {useState, useEffect, useCallback} from 'react';
import type {
    TokenPrices,
    AssetDataService
} from '@/types';

export function usePrices(service: AssetDataService, interval = 5000) {
    const [prices, setPrices] = useState<TokenPrices | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchPrices = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const newPrices = await service.getPrices();
            setPrices(newPrices);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch prices'));
        } finally {
            setLoading(false);
        }
    }, [service]);

    useEffect(() => {
        fetchPrices();
        const timer = setInterval(fetchPrices, interval);
        return () => clearInterval(timer);
    }, [fetchPrices, interval]);

    return {prices, loading, error, refetch: fetchPrices};
}

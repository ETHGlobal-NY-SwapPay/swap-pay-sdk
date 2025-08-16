import {useState, useEffect, useCallback} from 'react';
import type {
    TokenBalances,
    AssetDataService
} from '@/types';
import type {WalletProvider} from '@/types/wallet';

export function useBalances(
    service: AssetDataService,
    wallet: WalletProvider
) {
    const [balances, setBalances] = useState<TokenBalances | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchBalances = useCallback(async () => {
        if (!wallet.isConnected || !wallet.address) {
            setBalances(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const newBalances = await service.getBalances(wallet.address);
            setBalances(newBalances);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch balances'));
        } finally {
            setLoading(false);
        }
    }, [service, wallet.address, wallet.isConnected]);

    useEffect(() => {
        fetchBalances();
    }, [fetchBalances]);

    return {balances, loading, error, refetch: fetchBalances};
}

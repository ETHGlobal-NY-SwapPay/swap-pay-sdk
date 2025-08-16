import type {AssetDataService, AssetConfig} from '../types';
import type {WalletProvider} from '../types/wallet';
import {usePrices} from "./prices";
import {useBalances} from "./balances";


export function useAssetData(
    service: AssetDataService,
    assetsOrWallet: AssetConfig[] | WalletProvider,
    priceInterval = 5000
) {
    // Determine if second parameter is assets (old signature) or wallet (new signature)
    const isAssetsArray = Array.isArray(assetsOrWallet);
    const wallet = isAssetsArray ? undefined : assetsOrWallet;

    const pricesResult = usePrices(service, priceInterval);
    const balancesResult = useBalances(service, wallet || {isConnected: false, address: '', chainId: 0});

    return {
        prices: pricesResult.prices,
        balances: balancesResult.balances,
        loading: pricesResult.loading || balancesResult.loading,
        error: pricesResult.error || balancesResult.error,
        refetch: () => {
            pricesResult.refetch();
            balancesResult.refetch();
        }
    };
}

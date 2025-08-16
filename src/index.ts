// Self-contained component - no external CSS dependencies

// Main Components
export {Assets} from './components/Assets';
export type {AssetsProps} from './components/Assets';

// Hooks
export {usePrices} from './hooks/prices';
export {useBalances} from './hooks/balances';
export {useAssetData} from './hooks/useAssetData';

// Services
export {ChainlinkAssetService} from './services/ChainlinkAssetService';

// Utilities
export {PurchaseCalculator} from './utils/purchaseCalculator';

// Wallet Adapters
export {RainbowKitAdapter} from './adapters/RainbowKitAdapter';
export {MetaMaskAdapter} from './adapters/MetaMaskAdapter';
export type {WalletProvider, WalletContext} from './types/wallet';

// Types
export type {
    TokenPrices,
    TokenBalances,
    AssetConfig,
    AllocationState,
    ProviderConfig,
    PriceService,
    BalanceService,
    AssetDataService,
    PurchaseItem,
    PurchasePayload,
    FeeCalculation,
    FeeConfig
} from './types';

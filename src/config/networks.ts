import type {ProviderConfig} from '../types';
import {SEPOLIA_ASSETS} from './assets';

export const SEPOLIA_CONFIG: ProviderConfig = {
    chainId: 11155111, // Sepolia testnet
    contractAddress: "0xE0D0FdA517A04657eA2035c1e35bE4A291da4c33",
    supportedAssets: SEPOLIA_ASSETS,
};

export const MAINNET_CONFIG: ProviderConfig = {
    chainId: 1, // Ethereum mainnet
    contractAddress: "", // TODO: Add mainnet contract address
    supportedAssets: [], // TODO: Add mainnet assets
};

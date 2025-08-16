import type {ProviderConfig} from '../types';
import {SEPOLIA_ASSETS} from './assets';

export const SEPOLIA_CONFIG: ProviderConfig = {
    chainId: 11155111, // Sepolia testnet
    contractAddress: "0x195a3D95e94aA38D5549bdD50b30428ADfF97991",
    supportedAssets: SEPOLIA_ASSETS,
};

export const MAINNET_CONFIG: ProviderConfig = {
    chainId: 1, // Ethereum mainnet
    contractAddress: "", // TODO: Add mainnet contract address
    supportedAssets: [], // TODO: Add mainnet assets
};

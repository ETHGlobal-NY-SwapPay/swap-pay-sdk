import type {TokenPrices, TokenBalances, ProviderConfig, AssetDataService} from '../types';
import {createPublicClient, http} from 'viem';
import {sepolia} from 'viem/chains';
import {SEPOLIA_ASSETS} from "@/config/assets.ts";


export const SEPOLIA_CONFIG: ProviderConfig = {
    chainId: 11155111, // Sepolia testnet
    contractAddress: "0xE0D0FdA517A04657eA2035c1e35bE4A291da4c33",
    supportedAssets: SEPOLIA_ASSETS,
};

export class ChainlinkAssetService implements AssetDataService {
    private publicClient;

    constructor() {
        this.publicClient = createPublicClient({
            chain: sepolia,
            transport: http(SEPOLIA_CONFIG.rpcUrl),
        });
    }

    async getPrices(): Promise<TokenPrices> {
        return {
            ethUsd: BigInt(0),
            wbtcUsd: BigInt(0),
            daiUsd: BigInt(0),
            usdcUsd: BigInt(0),
            linkUsd: BigInt(0),
            wstethUsd: BigInt(0),
        };
    }

    async getBalances(address: string): Promise<TokenBalances> {
        return {
            eth: BigInt(0),
            wbtc: BigInt(0),
            dai: BigInt(0),
            usdc: BigInt(0),
            link: BigInt(0),
            wsteth: BigInt(0),
        };
    }
}

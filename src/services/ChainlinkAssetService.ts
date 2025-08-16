import type {TokenPrices, TokenBalances, ProviderConfig, AssetDataService} from '../types';
import {createPublicClient, http, type Address} from 'viem';
import {sepolia} from 'viem/chains';
import {DataFeeds} from "../assets/contracts/DataFeeds";

export class ChainlinkAssetService implements AssetDataService {
    private publicClient: any;

    constructor(private config: ProviderConfig) {
        this.publicClient = createPublicClient({
            chain: sepolia, // TODO: Make this configurable
            transport: config.rpcUrl ? http(config.rpcUrl) : http(),
        });
    }

    async getPrices(): Promise<TokenPrices> {
        try {
            const result = await this.publicClient.readContract({
                address: this.config.contractAddress as Address,
                abi: DataFeeds.abi,
                functionName: 'getPrices',
                args: [],
            }) as any;

            return {
                ethUsd: BigInt(result.ethUsd),
                wbtcUsd: BigInt(result.wbtcUsd), 
                daiUsd: BigInt(result.daiUsd),
                usdcUsd: BigInt(result.usdcUsd),
                linkUsd: BigInt(result.linkUsd),
                wstethUsd: BigInt(result.wstethUsd),
            };
        } catch (error) {
            console.error('Failed to fetch prices:', error);
            throw new Error('Failed to fetch prices');
        }
    }

    async getBalances(address: string): Promise<TokenBalances> {
        try {
            const result = await this.publicClient.readContract({
                address: this.config.contractAddress as Address,
                abi: DataFeeds.abi,
                functionName: 'getBalances',
                args: [address as Address],
            }) as any;

            return {
                eth: result.eth,
                wbtc: result.wbtc,
                dai: result.dai,
                usdc: result.usdc,
                link: result.link,
                wsteth: result.wsteth,
            };
        } catch (error) {
            console.error('Failed to fetch balances:', error);
            throw new Error('Failed to fetch balances');
        }
    }
}

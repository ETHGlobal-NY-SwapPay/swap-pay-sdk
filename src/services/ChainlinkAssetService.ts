import type {TokenPrices, TokenBalances, ProviderConfig, AssetDataService} from '../types';
import {createPublicClient, http, getContract, type Address} from 'viem';
import {sepolia} from 'viem/chains';

const DATA_FEEDS_ABI = [
    {
        inputs: [{internalType: "address", name: "_account", type: "address"}],
        name: "getBalances",
        outputs: [
            {
                components: [
                    {internalType: "uint256", name: "eth", type: "uint256"},
                    {internalType: "uint256", name: "wbtc", type: "uint256"},
                    {internalType: "uint256", name: "dai", type: "uint256"},
                    {internalType: "uint256", name: "usdc", type: "uint256"},
                    {internalType: "uint256", name: "link", type: "uint256"},
                    {internalType: "uint256", name: "wsteth", type: "uint256"},
                ],
                internalType: "struct DataFeeds.Balances",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getPrices",
        outputs: [
            {
                components: [
                    {internalType: "int256", name: "ethUsd", type: "int256"},
                    {internalType: "int256", name: "wbtcUsd", type: "int256"},
                    {internalType: "int256", name: "daiUsd", type: "int256"},
                    {internalType: "int256", name: "usdcUsd", type: "int256"},
                    {internalType: "int256", name: "linkUsd", type: "int256"},
                    {internalType: "int256", name: "wstethUsd", type: "int256"},
                ],
                internalType: "struct DataFeeds.Prices",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
] as const;


export class ChainlinkAssetService implements AssetDataService {
    private publicClient;

    constructor(private config: ProviderConfig) {
        this.publicClient = createPublicClient({
            chain: sepolia, // TODO: Make this configurable
            transport: config.rpcUrl ? http(config.rpcUrl) : http(),
        });
    }

    async getPrices(): Promise<TokenPrices> {
        try {
            const contract = getContract({
                address: this.config.contractAddress as Address,
                abi: DATA_FEEDS_ABI,
                client: {public: this.publicClient},
            });

            const result = await contract.read.getPrices([]);

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
            const contract = getContract({
                address: this.config.contractAddress as Address,
                abi: DATA_FEEDS_ABI,
                client: {public: this.publicClient},
            });

            const result = await contract.read.getBalances([address as Address]);

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

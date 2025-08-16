import type {AssetConfig} from '@/types';

export const SEPOLIA_ASSETS: AssetConfig[] = [
    {
        name: "ETH",
        symbol: "ETH",
        contractAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        priceFeedAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
        priceFeedDecimals: 8,
        tokenDecimals: 18,
        type: "native",
        description: "Native ETH for gas - no contract address needed",
        logo: "https://token-icons.s3.amazonaws.com/eth.png",
    },
    {
        name: "WBTC",
        symbol: "WBTC",
        contractAddress: "0xDD2f20DB368a8Dba08718d8801f08B3E38FEcd08",
        priceFeedAddress: "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
        priceFeedDecimals: 8,
        tokenDecimals: 8,
        type: "wrapped",
        description: "Wrapped Bitcoin (WBTC) on Sepolia",
        logo: "https://coin-images.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1696507857",
    },
    {
        name: "LINK",
        symbol: "LINK",
        contractAddress: "0x12D50F27df72c759B950a125FdeACe37e3ef21d1",
        priceFeedAddress: "0xc59E3633BAAC79493d908e63626716e204A45EdF",
        priceFeedDecimals: 8,
        tokenDecimals: 18,
        type: "utility",
        description: "Chainlink oracle token",
        logo: "https://coin-images.coingecko.com/coins/images/877/large/chainlink-new-logo.png?1696502009",
    },
];


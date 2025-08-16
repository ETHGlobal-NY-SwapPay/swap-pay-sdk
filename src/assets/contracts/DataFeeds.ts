export const DataFeeds = {
    address: "0x195a3D95e94aA38D5549bdD50b30428ADfF97991",
    abi: [
        {
            inputs: [],
            stateMutability: "nonpayable",
            type: "constructor",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "_account",
                    type: "address",
                },
            ],
            name: "getBalances",
            outputs: [
                {
                    components: [
                        {
                            internalType: "uint256",
                            name: "eth",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "wbtc",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "dai",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "usdc",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "link",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "wsteth",
                            type: "uint256",
                        },
                    ],
                    internalType: "struct DataConsumerV3.Balances",
                    name: "balances",
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
                        {
                            internalType: "int256",
                            name: "ethUsd",
                            type: "int256",
                        },
                        {
                            internalType: "int256",
                            name: "wbtcUsd",
                            type: "int256",
                        },
                        {
                            internalType: "int256",
                            name: "daiUsd",
                            type: "int256",
                        },
                        {
                            internalType: "int256",
                            name: "usdcUsd",
                            type: "int256",
                        },
                        {
                            internalType: "int256",
                            name: "linkUsd",
                            type: "int256",
                        },
                        {
                            internalType: "int256",
                            name: "wstethUsd",
                            type: "int256",
                        },
                    ],
                    internalType: "struct DataConsumerV3.Prices",
                    name: "prices",
                    type: "tuple",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
    ],
};

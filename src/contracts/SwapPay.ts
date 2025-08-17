export const SWAP_PAY_CONTRACT = {
  sepolia: {
    address: "0xC016492ee437338437F777e4AAc9b6495e1e1210" as const,
    abi: [
      {
        inputs: [
          {
            internalType: "address[]",
            name: "_tokens",
            type: "address[]",
          },
          {
            internalType: "uint256[]",
            name: "_amounts",
            type: "uint256[]",
          },
          {
            internalType: "address",
            name: "_target",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "_callFunctionData",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "_amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "execute",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
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
              {
                internalType: "uint256",
                name: "pyusd",
                type: "uint256",
              },
            ],
            internalType: "struct IFeeds.Balances",
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
              {
                internalType: "int256",
                name: "pyusdUsd",
                type: "int256",
              },
            ],
            internalType: "struct IFeeds.Prices",
            name: "prices",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ] as const,
  },
} as const;

// Native token sentinel value
export const NATIVE_SENTINEL = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" as const;

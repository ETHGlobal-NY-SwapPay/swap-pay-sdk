# Swap Pay SDK

A React SDK for building DeFi swap and payment interfaces with support for multiple wallet providers and real-time price feeds.

## Features

- 🔄 Multi-token swap functionality
- 💰 Real-time price feeds via Chainlink
- 👛 Multiple wallet adapter support (MetaMask, RainbowKit)
- ⚡ React hooks for balances, prices, and asset data
- 🎨 Tailwind CSS styled components
- 📱 TypeScript support

## Installation

```bash
npm install swap-pay-sdk
```

### Peer Dependencies

Make sure you have the following peer dependencies installed:

```bash
npm install react react-dom @rainbow-me/rainbowkit @tanstack/react-query viem wagmi tailwindcss
```

## Quick Start

### 1. Wrap your app with providers

```tsx
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Assets } from 'swap-pay-sdk';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider>
          <YourApp />
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
```

### 2. Use the Assets component

```tsx
import { Assets } from 'swap-pay-sdk';

function YourApp() {
  return (
    <Assets
      wallet={wallet}
      targetAmount={2000}
      onAllocationChange={(state) => {
        console.log('Allocation changed:', state);
      }}
      onPurchase={(state) => {
        console.log('Purchase triggered:', state);
      }}
    />
  );
}
```

## API Reference

### Components

#### `<Assets />`

Main component for asset allocation and swapping.

**Props:**
- `wallet`: Wallet provider instance
- `targetAmount`: Target amount for allocation
- `onAllocationChange`: Callback for allocation changes
- `onPurchase`: Callback for purchase events

### Hooks

#### `usePrices()`
Get real-time token prices.

#### `useBalances()`
Get user token balances.

#### `useAssetData()`
Get comprehensive asset data including prices and balances.

### Wallet Adapters

#### `RainbowKitAdapter`
Adapter for RainbowKit wallet connection.

#### `MetaMaskAdapter`
Adapter for MetaMask wallet connection.

### Services

#### `ChainlinkAssetService`
Service for fetching price data from Chainlink oracles.

## Development

### Building the library

```bash
npm run build
```

### Development with demo

```bash
npm run dev
```

### Linting

```bash
npm run lint
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request




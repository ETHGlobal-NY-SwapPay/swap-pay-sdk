import type {WalletProvider} from '../types/wallet';

export class RainbowKitAdapter implements WalletProvider {
    constructor(
        private wagmiAccount: { address?: string; isConnected: boolean },
        private wagmiChainId: number
    ) {}

    get address() {
        return this.wagmiAccount.address;
    }

    get isConnected() {
        return this.wagmiAccount.isConnected;
    }

    get chainId() {
        return this.wagmiChainId;
    }
}

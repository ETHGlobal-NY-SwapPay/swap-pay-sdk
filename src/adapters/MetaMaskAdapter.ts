import type {WalletProvider} from '../types/wallet';

// MetaMask Adapter
export class MetaMaskAdapter implements WalletProvider {
    constructor(private ethereum: {
        selectedAddress?: string;
        chainId?: string;
        request: (params: { method: string }) => Promise<string[]>;
    }) {}

    get address() {
        return this.ethereum.selectedAddress;
    }

    get isConnected() {
        return !!this.ethereum.selectedAddress;
    }

    get chainId() {
        return this.ethereum.chainId ? parseInt(this.ethereum.chainId, 16) : undefined;
    }

    async connect() {
        await this.ethereum.request({method: 'eth_requestAccounts'});
    }
}

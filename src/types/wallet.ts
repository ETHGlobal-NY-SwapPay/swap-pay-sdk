// Wallet Provider Interface
export interface WalletProvider {
    address?: string;
    isConnected: boolean;
    chainId?: number;
    connect?: () => Promise<void>;
    disconnect?: () => Promise<void>;
}

export interface Wallet {
    isConnected: boolean;
    address: string;
    chainId: number;
}

export interface WalletContext {
    provider: WalletProvider;
    isSupported: boolean;
}

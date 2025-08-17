import type { Address, Hex } from 'viem';

export interface BatchCall {
  to: Address;
  data: Hex;
}

export interface TargetContract {
  address: Address;
  callData: Hex;
  paymentTokenAmount: bigint; // Amount in payment token (e.g., PYUSD with 6 decimals)
}

export interface SwapExecuteParams {
  inTokens: Address[];
  inAmounts: bigint[];
  target: Address;
  callData: Hex;
  paymentTokenAmount: bigint;
  minOut?: bigint;
}

export interface SwapExecutionResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  batchCalls?: BatchCall[];
}

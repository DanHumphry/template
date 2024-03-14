import Web3 from 'web3';
import { Eip1193Provider, ethers } from 'ethers';
import { EthExecutionAPI, SupportedProviders, TransactionReceipt } from 'web3-types';
import { Web3ContextInitOptions } from 'web3-core';

export interface TransactionActions {
    beforeAction?: () => void | Promise<void>; // ex) loading is true ..
    afterAction: (receipt: TransactionReceipt) => void | Promise<void>; // ex) loading is false, set balanceOf ..
    exceptionAction?: (error: any) => void | Promise<void>; // error handler
}

export interface TransactionObject {
    to: string; // 실행할 컨트랙트 주소
    from: string; // 실행할 지갑 주소
    data: string; // 실행할 function data
    value?: string; // payable value
}

/**
 * 트랜잭션 기능이 있는 원격 지갑을 나타냅니다.
 */
export default class RemoteWallet {
    private readonly provider;

    private readonly web3;

    constructor(provider: string | SupportedProviders<EthExecutionAPI> | Web3ContextInitOptions<EthExecutionAPI>) {
        this.provider = new ethers.BrowserProvider(provider as Eip1193Provider);
        this.web3 = new Web3(provider);
    }

    public async makeTransactionHash(tx: TransactionObject, actions: TransactionActions): Promise<string> {
        try {
            await this.provider.estimateGas(tx); // 만약 트랜잭션이 실패한다면 여기서 throw 날림
            const signer = await this.provider.getSigner();
            const TX = await signer.sendTransaction(tx);
            return TX.hash;
        } catch (error: any) {
            console.log(error);
            if (actions.exceptionAction) actions.exceptionAction(error);
            return '';
        }
    }

    // external function,
    public async sendTransaction(txHash: string, actions: TransactionActions) {
        try {
            await this.transactionWaitFunction(txHash, actions);
        } catch (error: any) {
            console.log(error);
            if (actions.exceptionAction) actions.exceptionAction(error);
        }
    }

    private async transactionWaitFunction(txHash: string, actions: TransactionActions) {
        console.log(txHash);

        try {
            const receipt: TransactionReceipt = await this.web3.eth.getTransactionReceipt(txHash);
            actions.afterAction(receipt);
        } catch (_) {
            setTimeout(async () => {
                await this.transactionWaitFunction(txHash, actions);
            }, 1000);
        }
    }
}

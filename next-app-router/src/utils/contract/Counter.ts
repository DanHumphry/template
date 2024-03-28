import { Web3ContextInitOptions } from 'web3-core';
import { EthExecutionAPI, SupportedProviders } from 'web3-types';
import { AddressZero } from '@ethersproject/constants';

import ContractBase from '@/utils/contract/_base/Contract.Base';
import { TransactionObject } from '@/utils/contract/_base/RemoteWallet';
import CounterJSON from '@/../artifacts/contracts/Counter.sol/Counter.json';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BigNumberish, AddressLike, BytesLike } from 'ethers';

export default class Counter extends ContractBase {
    constructor(
        provider: string | SupportedProviders<EthExecutionAPI> | Web3ContextInitOptions<EthExecutionAPI>,
        address: string,
    ) {
        if (!CounterJSON.abi) throw new Error('enter the "npm run compile" please');

        super(provider, { baseABI: CounterJSON.abi, baseAddress: address });
    }

    public async count(): Promise<bigint> {
        return this.contract['count()']();
    }
    public async readCount(): Promise<bigint> {
        return this.contract['readCount()']();
    }
    public writeCount(from: string, value = '0'): TransactionObject {
        return {
            from,
            to: this.address,
            data: this.contract.interface.encodeFunctionData('writeCount()'),
            value,
        };
    }

    public staticCall = {
        writeCount: async ({
            _from = AddressZero,
            _value = '0',
        }: {
            _from?: string;
            _value?: string;
        }): Promise<bigint> => {
            return this.getMethod('writeCount()').staticCall({ from: _from, value: _value });
        },
    };
}

import { Web3ContextInitOptions } from 'web3-core';
import { EthExecutionAPI, SupportedProviders } from 'web3-types';
import { AddressZero } from '@ethersproject/constants';

import ContractBase from '@/utils/contract/_base/Contract.Base';
import { TransactionObject } from '@/utils/contract/_base/RemoteWallet';
import XTokenJSON from '@/../artifacts/contracts/XToken.sol/XToken.json';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BigNumberish, AddressLike, BytesLike } from 'ethers';

export default class XToken extends ContractBase {
    constructor(
        provider: string | SupportedProviders<EthExecutionAPI> | Web3ContextInitOptions<EthExecutionAPI>,
        address: string,
    ) {
        if (!XTokenJSON.abi) throw new Error('enter the "npm run compile" please');

        super(provider, { baseABI: XTokenJSON.abi, baseAddress: address });
    }

    public async DEFAULT_ADMIN_ROLE(): Promise<string> {
        return this.contract['DEFAULT_ADMIN_ROLE()']();
    }
    public async MINTER_ROLE(): Promise<string> {
        return this.contract['MINTER_ROLE()']();
    }
    public async PAUSER_ROLE(): Promise<string> {
        return this.contract['PAUSER_ROLE()']();
    }
    public async allowance(owner: AddressLike, spender: AddressLike): Promise<bigint> {
        return this.contract['allowance(address,address)'](owner, spender);
    }
    public approve(
        from: string,
        params: { spender: AddressLike; amount: BigNumberish },
        value = '0',
    ): TransactionObject {
        return {
            from,
            to: this.address,
            data: this.contract.interface.encodeFunctionData('approve(address,uint256)', Object.values(params)),
            value,
        };
    }
    public async balanceOf(account: AddressLike): Promise<bigint> {
        return this.contract['balanceOf(address)'](account);
    }
    public burn(from: string, params: { amount: BigNumberish }, value = '0'): TransactionObject {
        return {
            from,
            to: this.address,
            data: this.contract.interface.encodeFunctionData('burn(uint256)', Object.values(params)),
            value,
        };
    }
    public burnFrom(
        from: string,
        params: { account: AddressLike; amount: BigNumberish },
        value = '0',
    ): TransactionObject {
        return {
            from,
            to: this.address,
            data: this.contract.interface.encodeFunctionData('burnFrom(address,uint256)', Object.values(params)),
            value,
        };
    }
    public async decimals(): Promise<bigint> {
        return this.contract['decimals()']();
    }
    public decreaseAllowance(
        from: string,
        params: { spender: AddressLike; subtractedValue: BigNumberish },
        value = '0',
    ): TransactionObject {
        return {
            from,
            to: this.address,
            data: this.contract.interface.encodeFunctionData(
                'decreaseAllowance(address,uint256)',
                Object.values(params),
            ),
            value,
        };
    }
    public async getRoleAdmin(role: BytesLike): Promise<string> {
        return this.contract['getRoleAdmin(bytes32)'](role);
    }
    public async getRoleMember(role: BytesLike, index: BigNumberish): Promise<string> {
        return this.contract['getRoleMember(bytes32,uint256)'](role, index);
    }
    public async getRoleMemberCount(role: BytesLike): Promise<bigint> {
        return this.contract['getRoleMemberCount(bytes32)'](role);
    }
    public grantRole(from: string, params: { role: BytesLike; account: AddressLike }, value = '0'): TransactionObject {
        return {
            from,
            to: this.address,
            data: this.contract.interface.encodeFunctionData('grantRole(bytes32,address)', Object.values(params)),
            value,
        };
    }
    public async hasRole(role: BytesLike, account: AddressLike): Promise<boolean> {
        return this.contract['hasRole(bytes32,address)'](role, account);
    }
    public increaseAllowance(
        from: string,
        params: { spender: AddressLike; addedValue: BigNumberish },
        value = '0',
    ): TransactionObject {
        return {
            from,
            to: this.address,
            data: this.contract.interface.encodeFunctionData(
                'increaseAllowance(address,uint256)',
                Object.values(params),
            ),
            value,
        };
    }
    public mint(from: string, params: { to: AddressLike; amount: BigNumberish }, value = '0'): TransactionObject {
        return {
            from,
            to: this.address,
            data: this.contract.interface.encodeFunctionData('mint(address,uint256)', Object.values(params)),
            value,
        };
    }
    public async name(): Promise<string> {
        return this.contract['name()']();
    }
    public async owner(): Promise<string> {
        return this.contract['owner()']();
    }
    public pause(from: string, value = '0'): TransactionObject {
        return {
            from,
            to: this.address,
            data: this.contract.interface.encodeFunctionData('pause()'),
            value,
        };
    }
    public async paused(): Promise<boolean> {
        return this.contract['paused()']();
    }
    public renounceOwnership(from: string, value = '0'): TransactionObject {
        return {
            from,
            to: this.address,
            data: this.contract.interface.encodeFunctionData('renounceOwnership()'),
            value,
        };
    }
    public renounceRole(
        from: string,
        params: { role: BytesLike; account: AddressLike },
        value = '0',
    ): TransactionObject {
        return {
            from,
            to: this.address,
            data: this.contract.interface.encodeFunctionData('renounceRole(bytes32,address)', Object.values(params)),
            value,
        };
    }
    public revokeRole(from: string, params: { role: BytesLike; account: AddressLike }, value = '0'): TransactionObject {
        return {
            from,
            to: this.address,
            data: this.contract.interface.encodeFunctionData('revokeRole(bytes32,address)', Object.values(params)),
            value,
        };
    }
    public async supportsInterface(interfaceId: BytesLike): Promise<boolean> {
        return this.contract['supportsInterface(bytes4)'](interfaceId);
    }
    public async symbol(): Promise<string> {
        return this.contract['symbol()']();
    }
    public async totalSupply(): Promise<bigint> {
        return this.contract['totalSupply()']();
    }
    public transfer(from: string, params: { to: AddressLike; amount: BigNumberish }, value = '0'): TransactionObject {
        return {
            from,
            to: this.address,
            data: this.contract.interface.encodeFunctionData('transfer(address,uint256)', Object.values(params)),
            value,
        };
    }
    public transferFrom(
        from: string,
        params: { from: AddressLike; to: AddressLike; amount: BigNumberish },
        value = '0',
    ): TransactionObject {
        return {
            from,
            to: this.address,
            data: this.contract.interface.encodeFunctionData(
                'transferFrom(address,address,uint256)',
                Object.values(params),
            ),
            value,
        };
    }
    public transferOwnership(from: string, params: { newOwner: AddressLike }, value = '0'): TransactionObject {
        return {
            from,
            to: this.address,
            data: this.contract.interface.encodeFunctionData('transferOwnership(address)', Object.values(params)),
            value,
        };
    }
    public unpause(from: string, value = '0'): TransactionObject {
        return {
            from,
            to: this.address,
            data: this.contract.interface.encodeFunctionData('unpause()'),
            value,
        };
    }

    public staticCall = {
        approve: async (
            spender: AddressLike,
            amount: BigNumberish,
            { _from = AddressZero, _value = '0' }: { _from?: string; _value?: string },
        ): Promise<boolean> => {
            return this.getMethod('approve(address,uint256)').staticCall(spender, amount, {
                from: _from,
                value: _value,
            });
        },
        burn: async (
            amount: BigNumberish,
            { _from = AddressZero, _value = '0' }: { _from?: string; _value?: string },
        ): Promise<Promise<void>> => {
            return this.getMethod('burn(uint256)').staticCall(amount, { from: _from, value: _value });
        },
        burnFrom: async (
            account: AddressLike,
            amount: BigNumberish,
            { _from = AddressZero, _value = '0' }: { _from?: string; _value?: string },
        ): Promise<Promise<void>> => {
            return this.getMethod('burnFrom(address,uint256)').staticCall(account, amount, {
                from: _from,
                value: _value,
            });
        },
        decreaseAllowance: async (
            spender: AddressLike,
            subtractedValue: BigNumberish,
            { _from = AddressZero, _value = '0' }: { _from?: string; _value?: string },
        ): Promise<boolean> => {
            return this.getMethod('decreaseAllowance(address,uint256)').staticCall(spender, subtractedValue, {
                from: _from,
                value: _value,
            });
        },
        grantRole: async (
            role: BytesLike,
            account: AddressLike,
            { _from = AddressZero, _value = '0' }: { _from?: string; _value?: string },
        ): Promise<Promise<void>> => {
            return this.getMethod('grantRole(bytes32,address)').staticCall(role, account, {
                from: _from,
                value: _value,
            });
        },
        increaseAllowance: async (
            spender: AddressLike,
            addedValue: BigNumberish,
            { _from = AddressZero, _value = '0' }: { _from?: string; _value?: string },
        ): Promise<boolean> => {
            return this.getMethod('increaseAllowance(address,uint256)').staticCall(spender, addedValue, {
                from: _from,
                value: _value,
            });
        },
        mint: async (
            to: AddressLike,
            amount: BigNumberish,
            { _from = AddressZero, _value = '0' }: { _from?: string; _value?: string },
        ): Promise<Promise<void>> => {
            return this.getMethod('mint(address,uint256)').staticCall(to, amount, { from: _from, value: _value });
        },
        pause: async ({
            _from = AddressZero,
            _value = '0',
        }: {
            _from?: string;
            _value?: string;
        }): Promise<Promise<void>> => {
            return this.getMethod('pause()').staticCall({ from: _from, value: _value });
        },
        renounceOwnership: async ({
            _from = AddressZero,
            _value = '0',
        }: {
            _from?: string;
            _value?: string;
        }): Promise<Promise<void>> => {
            return this.getMethod('renounceOwnership()').staticCall({ from: _from, value: _value });
        },
        renounceRole: async (
            role: BytesLike,
            account: AddressLike,
            { _from = AddressZero, _value = '0' }: { _from?: string; _value?: string },
        ): Promise<Promise<void>> => {
            return this.getMethod('renounceRole(bytes32,address)').staticCall(role, account, {
                from: _from,
                value: _value,
            });
        },
        revokeRole: async (
            role: BytesLike,
            account: AddressLike,
            { _from = AddressZero, _value = '0' }: { _from?: string; _value?: string },
        ): Promise<Promise<void>> => {
            return this.getMethod('revokeRole(bytes32,address)').staticCall(role, account, {
                from: _from,
                value: _value,
            });
        },
        transfer: async (
            to: AddressLike,
            amount: BigNumberish,
            { _from = AddressZero, _value = '0' }: { _from?: string; _value?: string },
        ): Promise<boolean> => {
            return this.getMethod('transfer(address,uint256)').staticCall(to, amount, { from: _from, value: _value });
        },
        transferFrom: async (
            from: AddressLike,
            to: AddressLike,
            amount: BigNumberish,
            { _from = AddressZero, _value = '0' }: { _from?: string; _value?: string },
        ): Promise<boolean> => {
            return this.getMethod('transferFrom(address,address,uint256)').staticCall(from, to, amount, {
                from: _from,
                value: _value,
            });
        },
        transferOwnership: async (
            newOwner: AddressLike,
            { _from = AddressZero, _value = '0' }: { _from?: string; _value?: string },
        ): Promise<Promise<void>> => {
            return this.getMethod('transferOwnership(address)').staticCall(newOwner, { from: _from, value: _value });
        },
        unpause: async ({
            _from = AddressZero,
            _value = '0',
        }: {
            _from?: string;
            _value?: string;
        }): Promise<Promise<void>> => {
            return this.getMethod('unpause()').staticCall({ from: _from, value: _value });
        },
    };
}

import Web3, { AbiParameter, ContractAbi } from 'web3';
import { Log, SupportedProviders, EthExecutionAPI } from 'web3-types';
import { Web3ContextInitOptions } from 'web3-core';
import { id, Interface, Contract, ethers } from 'ethers';

import { Eip1193Provider } from 'ethers/src.ts/providers/provider-browser';

/**
 * ContractBase 클래스는 이더리움 블록체인의 스마트 컨트랙트와 상호작용하기 위한 기본 구현을 제공하는 추상 클래스입니다.
 * 이 클래스는 컨트랙트 초기화, 로그 필터링, 로그 디코딩을 위한 메서드를 제공합니다.
 */
export default abstract class ContractBase {
    protected web3: Web3;

    protected address: string;

    protected contract: Contract;

    protected constructor(
        provider: string | SupportedProviders<EthExecutionAPI> | Web3ContextInitOptions<EthExecutionAPI>,
        contractObj: { baseAddress: string; baseABI: ContractAbi },
    ) {
        this.web3 = new Web3(provider);
        this.address = contractObj.baseAddress;

        const iface = new Interface(contractObj.baseABI);
        this.contract = new Contract(
            contractObj.baseAddress,
            iface.format(),
            typeof provider === 'string'
                ? new ethers.JsonRpcProvider(provider)
                : new ethers.BrowserProvider(provider as Eip1193Provider),
        );
    }

    protected filterLogs(logs: Log[], eventId: string): Log {
        const eventSignature = id(eventId); // === web3.eth.abi.encodeEventSignature(eventId)
        const filterArr = logs.filter(
            (item) => item?.topics?.length && item?.topics[0].toString().toLowerCase() === eventSignature.toLowerCase(),
        );
        return filterArr[0];
    }

    protected decodeLog(inputs: AbiParameter[], data: string, topics: string[]) {
        return this.web3.eth.abi.decodeLog(inputs, data, topics.slice(1)); // topic 0 index === eventSig
    }

    protected getMethod(methodName: string) {
        return this.contract.getFunction(methodName);
    }
}

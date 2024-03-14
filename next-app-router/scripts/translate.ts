import { resolve } from 'path';
import fs from 'fs';
import { AbiParameter, FunctionDeclaration } from 'typechain';
import { generateObjectTypeLiteral } from '@typechain/ethers-v6/dist/codegen/types';
import { sync as globSync } from 'glob';
import common_1 from '@typechain/ethers-v6/dist/common';
import { AbiOutputParameter } from 'typechain/dist/parser/abiParser';

interface GenerateTypeOptions {
    returnResultObject?: boolean;
    useStructs?: boolean;
    includeLabelsInTupleTypes?: boolean;
}

/**
 * 주어진 항목과 선택적 길이에 따라 배열 또는 튜플 유형을 생성합니다.
 * 길이가 제공되고 6보다 작으면 튜플 유형을 생성합니다. 그렇지 않으면 배열 유형을 생성합니다.
 *
 * @param {string} item - The item to be used in the array or tuple type.
 * @param {number} [length] - The optional length of the tuple type. Defaults to undefined.
 *
 * @return {string} - The generated array or tuple type.
 */
function generateArrayOrTupleType(item: string, length?: number): string {
    if (length !== undefined && length < 6) {
        return `[${Array(length).fill(item).join(', ')}]`;
    }

    return `${item}[]`;
}

/**
 * 주어진 EVM 유형에 대한 입력 유형을 생성합니다.
 *
 * @param options - The options for generating the type.
 * @param evmType - The EVM type to generate the input type for.
 * @returns The generated input type as a string.
 */
function generateInputType(options: GenerateTypeOptions, evmType: any): string {
    switch (evmType.type) {
        case 'integer':
        case 'uinteger':
        case 'uint256':
        case 'uint128':
        case 'uint64':
        case 'uint32':
        case 'uint16':
        case 'uint8':
        case 'uint':
            return 'BigNumberish';
        case 'uint[]':
        case 'uint256[]':
            return 'BigNumberish[]';
        case 'address':
            return 'AddressLike';
        case 'address[]':
            return 'AddressLike[]';
        case 'bytes32':
        case 'bytes4':
        case 'bytes':
        case 'dynamic-bytes':
            return 'BytesLike';
        case 'bytes32[]':
        case 'bytes4[]':
        case 'bytes[]':
            return 'BytesLike[]';
        case 'array':
            return generateArrayOrTupleType(generateInputType(options, evmType.itemType), evmType.size);
        case 'boolean':
        case 'bool':
            return 'boolean';
        case 'string':
            return 'string';
        case 'tuple':
            if (evmType.structName && options.useStructs) {
                return evmType.structName.toString() + common_1.STRUCT_INPUT_POSTFIX;
            }
            return generateObjectTypeLiteral(evmType, generateInputType.bind(null, { ...options, useStructs: true }));
        case 'unknown':
        default:
            return 'any';
    }
}

/**
 * 주어진 입력 배열과 옵션을 기반으로 입력 유형을 생성합니다.
 *
 * @param {Array<AbiParameter>} input - An array of AbiParameter objects representing the input parameters.
 * @param {GenerateTypeOptions} options - An object containing options for generating the input types.
 * @returns {string} - The generated input types as a string.
 */
function generateInputTypes(input: Array<AbiParameter>, options: GenerateTypeOptions) {
    if (input.length === 0) {
        return '';
    }
    return `${input
        // eslint-disable-next-line @typescript-eslint/no-shadow
        .map((input, index) => `${input.name || `arg${index}`}: ${generateInputType(options, input)}`)
        .join(', ')}, `;
}

/**
 * 주어진 옵션과 evmType을 기반으로 출력 유형을 생성합니다.
 *
 * @param {GenerateTypeOptions} options - The options for generating the output type.
 * @param {any} evmType - The EVM type for which the output type needs to be generated.
 * @return {string} - The generated output type.
 */
function generateOutputType(options: GenerateTypeOptions, evmType: any): string {
    let returnValue = '';

    switch (evmType.type) {
        case 'integer':
        case 'uinteger':
        case 'uint256':
        case 'uint128':
        case 'uint64':
        case 'uint32':
        case 'uint16':
        case 'uint8':
        case 'uint':
            returnValue = 'bigint';
            break;
        case 'void':
            returnValue = 'void';
            break;
        case 'address':
        case 'bytes32':
        case 'bytes4':
        case 'bytes':
        case 'dynamic-bytes':
        case 'string':
            returnValue = 'string';
            break;
        case 'boolean':
        case 'bool':
            returnValue = 'boolean';
            break;
        case 'tuple':
            if (evmType.structName && options.useStructs) {
                console.log(evmType.structName);
                // return evmType.structName.toString() + common_1.STRUCT_OUTPUT_POSTFIX;
            }
            break;
        default:
            if (typeof evmType.type === 'string' && evmType.type.indexOf('[]') !== -1) {
                returnValue = `${generateOutputType(options, { type: evmType.type.replace('[]', '') })}[]`;
            }
            break;
    }

    if (!returnValue) return 'any';
    return returnValue;
}

/**
 * 제공된 옵션과 출력을 기반으로 출력 유형을 생성합니다.
 *
 * @param {GenerateTypeOptions} options - The options to use for generating the output types.
 * @param {Array<AbiOutputParameter>} outputs - The array of output parameters to generate types for.
 * @returns {any} - The generated output types.
 */
function generateOutputTypes(options: GenerateTypeOptions, outputs: Array<AbiOutputParameter>) {
    if (!options.returnResultObject && outputs.length === 1) {
        return generateOutputType(options, outputs[0]);
    }

    if (outputs.length === 0) {
        return 'Promise<void>';
    }

    //  & { amountA: undefined; amountB: undefined; liquidity: undefined }
    const arrayType: string[] = [];
    const objectType: Record<string, string> = {};
    let result = '';

    for (let i = 0; i < outputs.length; i++) {
        arrayType.push(generateOutputType(options, outputs[i]));
        objectType[outputs[i].name] = generateOutputType(options, outputs[i]);
    }
    result = `[${arrayType.join(',')}] & ${JSON.stringify(objectType)}`;

    return result;
}

/**
 * 함수 선언의 이름을 생성합니다.
 *
 * @param {FunctionDeclaration} fn - The function declaration object.
 * @returns {string} The generated name for the function declaration.
 */
function genName(fn: FunctionDeclaration): string {
    return `${fn.name}(${fn.inputs.map((item) => item.type)})`;
}

/**
 * 컨트랙트 함수를 호출하기 위해 컨트랙트 트랜잭션을 생성합니다.
 *
 * @param {FunctionDeclaration} fn - The contract function declaration.
 * @param {string} [overloadedName] - Optional overloaded name for the contract function.
 *
 * @return {string} The generated contract transaction.
 */
function generateContractTransaction(fn: FunctionDeclaration, overloadedName?: string): string {
    const _params = generateInputTypes(fn.inputs, { useStructs: true });
    const params = _params ? `params: {${_params}}, value = '0'` : `value = '0'`;
    const values = _params ? `, Object.values(params)` : '';

    return `public ${overloadedName ?? fn.name}(from: string, ${params}): TransactionObject {
        return {
            from,
            to: this.address,
            data: this.contract.interface.encodeFunctionData('${genName(fn)}' ${values}),
            value,
        };
    }`;
}

/**
 * 스마트 컨트랙트에 대한 View, Pure 함수를 생성합니다.
 *
 * @param {FunctionDeclaration} fn - The function declaration representing the view function.
 * @param {string} [overloadedName] - Optional name to overload the original function name.
 * @returns {string} - The generated view function as a string.
 */
function generateViewFunction(fn: FunctionDeclaration, overloadedName?: string): string {
    return `public async ${overloadedName ?? fn.name}(${generateInputTypes(fn.inputs, {
        useStructs: true,
    })}): ${`Promise<${generateOutputTypes({ useStructs: true }, fn.outputs)}>`} {
         return this.contract['${genName(fn)}'](${fn.inputs.map((item) => item.name).join(',')});
    }`;
}

/**
 * 솔리디티 함수 선언에 대한 코드를 생성합니다.
 *
 * @param {FunctionDeclaration} fn - The function declaration object.
 * @param {string} overloadedName - Optional. The name of the overloaded function if applicable.
 *
 * @return {string} The generated code for the function.
 */
function codegenFunctions(fn: FunctionDeclaration, overloadedName?: string): string {
    if (fn.stateMutability === 'pure' || fn.stateMutability === 'view') return generateViewFunction(fn, overloadedName);
    return generateContractTransaction(fn, overloadedName);
}

function codeGenStaticCalls(fn: FunctionDeclaration, overloadedName?: string): string {
    const _params = generateInputTypes(fn.inputs, { useStructs: true });

    if (!_params) {
        return `${overloadedName ?? fn.name}: async ({ _from = AddressZero, _value = '0' }: { _from?: string; _value?: string }): ${`Promise<${generateOutputTypes({ useStructs: true }, fn.outputs)}>`} => {
            return this.getMethod('${genName(fn)}').staticCall({ from: _from, value: _value  });
        },`;
    }

    return `${overloadedName ?? fn.name}: async (${generateInputTypes(fn.inputs, {
        useStructs: true,
    })} { _from = AddressZero, _value = '0' }: { _from?: string; _value?: string }): ${`Promise<${generateOutputTypes({ useStructs: true }, fn.outputs)}>`} => {
            return this.getMethod('${genName(fn)}').staticCall(${fn.inputs.map((item) => item.name).join(',')}, { from: _from, value: _value });
        },`;
}

/**
 * Contract 디렉터리에서 JSON 파일을 찾습니다.
 *
 * @returns {object} an object containing the root directory, contracts directory, and an array of contracts.
 */
function findFiles() {
    const rootDir = resolve(__dirname, '../');
    const contractsDir = resolve(rootDir, 'artifacts/contracts');
    const contracts = globSync('**/*.json', { cwd: contractsDir }).filter((item) => !item.includes('.dbg.'));

    return {
        rootDir,
        contractsDir,
        contracts,
    };
}

type Files = ReturnType<typeof findFiles>;

/**
 * 지정된 컨트랙트 파일에 대한 구현 코드 생성
 *
 * @param {Files} files - The contract files to generate implementation for
 * @returns {void}
 */
function generateImpl({ contracts, rootDir }: Files) {
    console.log('Generating Implements');

    // eslint-disable-next-line @typescript-eslint/naming-convention,no-restricted-syntax,no-underscore-dangle
    for (const filePath of contracts) {
        const fileNames = filePath.replace('.json', '').split('/');
        const fileName = fileNames[fileNames.length - 1];
        // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/no-dynamic-require
        const json = require(`${rootDir}/artifacts/contracts/${filePath}`);

        const functions = json.abi
            .filter((item: { type: string }) => item.type === 'function')
            .map((item: any) => `${codegenFunctions(item)}\n`)
            .join('');

        const staticCalls = json.abi
            .filter(
                (item: { type: string; stateMutability: string }) =>
                    item.type === 'function' && !(item.stateMutability === 'pure' || item.stateMutability === 'view'),
            )
            .map((item: any) => `${codeGenStaticCalls(item)}\n`)
            .join('');

        const myContractImplCode = `
import { Web3ContextInitOptions } from 'web3-core';
import { EthExecutionAPI, SupportedProviders } from 'web3-types';
import { AddressZero } from '@ethersproject/constants';

import ContractBase from '@/utils/contract/_base/Contract.Base';
import { TransactionObject } from '@/utils/contract/_base/RemoteWallet';
import ${fileName}JSON from '@/../artifacts/contracts/${filePath}';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BigNumberish, AddressLike, BytesLike } from 'ethers';


export default class ${fileName} extends ContractBase {
    constructor(
        provider: string | SupportedProviders<EthExecutionAPI> | Web3ContextInitOptions<EthExecutionAPI>,
        address: string
    ) {
        if (!${fileName}JSON.abi) throw new Error('enter the "npm run compile" please');

        super(provider, { baseABI: ${fileName}JSON.abi, baseAddress: address });
    }

    ${functions}
    
    public staticCall = {
        ${staticCalls}
    }
}`;

        // Write MyContractImpl.ts file
        const myContractImplFilePath = `${rootDir}/src/utils/contract/${fileName}.ts`; // Replace with the desired output path
        fs.writeFileSync(myContractImplFilePath, myContractImplCode, 'utf-8');

        console.log(`MyContractImpl.ts has been generated successfully at ${myContractImplFilePath}`);
    }
}

(function main() {
    const files = findFiles();

    generateImpl(files);
})();

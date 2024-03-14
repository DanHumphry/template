export enum NetworkId {
    ETH_MAIN = '0x1',
    ETH_MUMBAI = '0x13881',
    ARB_ONE = '0xa4b1',
    ARB_GOERLI = '0x66eed',
}

export const getScanLink = (chainId: NetworkId) => {
    switch (+chainId) {
        case Number(NetworkId.ETH_MUMBAI):
            return 'https://mumbai.polygonscan.com/tx/';
        case Number(NetworkId.ARB_ONE):
            return 'https://arbiscan.io/tx/';
        case Number(NetworkId.ARB_GOERLI):
            return 'https://goerli.arbiscan.io/tx/';
        case Number(NetworkId.ETH_MAIN):
        default:
            return 'https://etherscan.io/tx/';
    }
};

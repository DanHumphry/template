import { useEffect, useState } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';

/**
 * [Text content does not match server-rendered HTML] error,
 * Solution 1: Using useEffect to run on the client only
 * ref: https://nextjs.org/docs/messages/react-hydration-error
 */
const UseWalletHook = () => {
    const { address: connectedAddress, isDisconnected } = useAccount();
    const { isLoading: walletConnectLoading } = useSendTransaction();

    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isDisconnected) return setAddress('');
        if (connectedAddress) setAddress(connectedAddress);
    }, [connectedAddress, isDisconnected]);

    useEffect(() => {
        setIsLoading(walletConnectLoading);
    }, [walletConnectLoading]);

    return { address, isLoading };
};

export default UseWalletHook;

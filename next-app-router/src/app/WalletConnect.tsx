'use client';

import React, { useEffect, useState } from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useDisconnect } from 'wagmi';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { TransactionReceipt } from 'web3-types';

import XToken from '@/utils/contract/XToken';
import constantAddress from '@/utils/contract/_deployed/mumbai/address.json';
import { Transaction } from '@/components/blocks/modal/TransactionModal';
import { putPendingTransaction } from '@/ducks/slice/wallet.slice';
import useWalletHook from '@/hooks/useWallet.hook';
// import useLanguages from '@/hooks/useLanguages.hook';
import Counter from '@/utils/contract/Counter';

const Container = styled.div`
    display: grid;
    justify-content: center;
    padding-top: 100px;
    grid-gap: 40px;

    div {
        margin-bottom: 10px;
    }

    button {
        border: 1px solid black;
        padding: 4px 8px;
        + button {
            margin-left: 2px;
        }
    }
`;

/**
 * 월렛커넥트
 * 지갑을 연결하고 연결된 지갑을 사용하여 다양한 트랜잭션과 작업을 수행합니다.
 *
 * @returns {React.Component} The WalletConnect component
 */
export default function WalletConnect() {
    const dispatch = useDispatch();
    // const Lang = useLanguages();

    const { open } = useWeb3Modal();
    const { disconnect } = useDisconnect();
    const { address, isLoading } = useWalletHook();

    const [count, setCount] = useState('');
    const [expectCount, setExpectCount] = useState('');

    const checkNetwork = () => {
        if (!address) {
            window.toast('error', '지갑연결을 하셔야 테스트가 가능합니다.');
            return false;
        }
        if (+window.ethereum.chainId !== 80001) {
            window.toast('error', '뭄바이 네트워크에서만 테스트 가능합니다. 네트워크를 변경해주세요.');
            return false;
        }

        return true;
    };

    const readCount = async () => {
        if (!checkNetwork()) return;

        const counter = new Counter(window.ethereum, constantAddress.Counter);
        const _count = await counter.readCount();
        setCount(_count.toString());
    };

    const writeCount = () => {
        if (!checkNetwork()) return;

        const transactionArray: Transaction[] = [];
        const counter = new Counter(window.ethereum, constantAddress.Counter);
        const writeTx = counter.writeCount(address);

        transactionArray.push({
            title: 'Counter',
            subTitle: 'count 1 증가시키기',
            transactionData: writeTx,

            actions: {
                afterAction: (receipt: TransactionReceipt) => {
                    console.log(receipt);
                    window.toast('success', '트랜잭션 제출 완료');
                },
            },
        });

        dispatch(putPendingTransaction({ pending: transactionArray }));
    };

    const expectWriteCount = async () => {
        if (!checkNetwork()) return;

        const counter = new Counter(window.ethereum, constantAddress.Counter);
        const nextCount = await counter.staticCall.writeCount({});

        setExpectCount(nextCount.toString());
    };

    const stepTransaction = () => {
        if (!checkNetwork()) return;

        const transactionArray: Transaction[] = [];
        const erc20 = new XToken(window.ethereum, constantAddress.XToken);
        const approveTx = erc20.approve(address, {
            spender: constantAddress.Counter,
            amount: '100000000000000000',
        });

        transactionArray.push({
            title: 'approve1',
            subTitle: '토큰 승인 트랜잭션 1',
            transactionData: approveTx,

            actions: {
                afterAction: (receipt: TransactionReceipt) => {
                    console.log(receipt);
                    window.toast('success', '트랜잭션 제출 완료');
                },
            },
        });

        transactionArray.push({
            title: 'approve2',
            subTitle: '토큰 승인 트랜잭션 2',
            transactionData: approveTx,

            actions: {
                afterAction: (receipt: TransactionReceipt) => {
                    console.log(receipt);
                    window.toast('success', '트랜잭션 제출 완료');
                },
            },
        });

        dispatch(putPendingTransaction({ pending: transactionArray }));
    };

    // 카카오톡 인앱 브라우저 접속시 자동으로 크롬으로 전환되도록 유도 (완벽하지 않음, 개선 필요함)
    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        const targetUrl = window.location.href;

        if (userAgent.match(/kakaotalk/i)) {
            window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(targetUrl)}`;
        } else if (userAgent.match(/line/i)) {
            if (targetUrl.indexOf('?') !== -1) window.location.href = `${targetUrl}&openExternalBrowser=1`;
            else window.location.href = `${targetUrl}?openExternalBrowser=1`;
        } else if (
            userAgent.match(
                /inapp|naver|snapchat|wirtschaftswoche|thunderbird|instagram|everytimeapp|whatsApp|electron|wadiz|aliapp|zumapp|iphone(.*)whale|android(.*)whale|kakaostory|band|twitter|DaumApps|DaumDevice\/mobile|FB_IAB|FB4A|FBAN|FBIOS|FBSS|trill|SamsungBrowser\/[^1]/i,
            )
        ) {
            if (userAgent.match(/iphone|ipad|ipod/i)) {
                console.assert(true, 'can`t out');
            } else {
                window.location.href = `intent://${targetUrl.replace(
                    /https?:\/\//i,
                    '',
                )}#Intent;scheme=http;package=com.android.chrome;end`;
            }
        }
    }, []);

    return (
        <Container>
            <div>
                {address && (
                    <div>
                        <button onClick={() => disconnect()}>지갑 연결 헤제</button>
                        <button onClick={() => open({ view: 'Networks' })}>네트워크 변경</button>
                    </div>
                )}
                <button onClick={() => open()}>{!address ? '지갑연결' : address.slice(0, 8)}</button>
            </div>

            <div>
                <div>
                    <button disabled={isLoading} onClick={readCount}>
                        count 읽기
                    </button>
                    {count && <p>{count}</p>}
                </div>

                <div>
                    <button disabled={isLoading} onClick={writeCount}>
                        count 쓰기
                    </button>
                </div>

                <div>
                    <button disabled={isLoading} onClick={expectWriteCount}>
                        count 예상하기
                    </button>
                    {expectCount && <p>{expectCount}</p>}
                </div>
            </div>

            <div>
                <button disabled={isLoading} onClick={stepTransaction}>
                    스탭 트랜잭션
                </button>
            </div>
        </Container>
    );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from 'styled-components';
import { TransactionReceipt } from 'web3-types';

import useLanguages from '@/hooks/useLanguages.hook';
import { RootState } from '@/ducks/store';
import { deletePendingTransaction } from '@/ducks/slice/wallet.slice';
import { getScanLink } from '@/utils/variables';
import RemoteWallet, { TransactionActions, TransactionObject } from '@/utils/contract/_base/RemoteWallet';
import ArrowUpRightFromSquare from '@/components/atoms/arrow/Arrow.up.right.from.square';
import ArrowDown from '@/components/atoms/arrow/Arrow.down';
import ArrowUp from '@/components/atoms/arrow/Arrow.up';

export interface Transaction {
    title: string; // transaction modal title
    subTitle: string; // transaction modal desc, 추후에 해당 포인트에 JSX 를 들고와서 진행중인 트랜잭션의 자세한 내용을 담아야함

    transactionData: TransactionObject;
    transactionHash?: string;
    receipt?: TransactionReceipt;

    actions: TransactionActions;
}

function TransactionModal() {
    const dispatch = useDispatch();
    const Lang = useLanguages();

    const { transactions } = useSelector((state: RootState) => state.walletReducer);

    const [isSpread, setIsSpread] = useState<boolean[]>([]); // fold 여부 boolean[]
    const [isAble, setIsAble] = useState<boolean[]>([]); // 각 step 의 button 의 disable 상태 boolean[]
    const [isComplete, setIsComplete] = useState<boolean[]>([]); // 완료 여부 boolean[]
    const [isLoading, setIsLoading] = useState<number | null>(null); // index or null, 처리중인 transaction 의 loading 상태
    const [scanLink, setScanLink] = useState<string[]>([]); // 각 step 의 transaction hash
    const [close, setClose] = useState<boolean>(false); // close button

    const foldHandler = (index: number) => {
        const temp = [...isSpread];
        temp[index] = !isSpread[index];
        setIsSpread(temp);
    };

    const nextHandler = (index: number) => {
        setIsLoading(null);

        if (transactions.pending.length > index) {
            const isSpreadCopy = [...isSpread];
            isSpreadCopy[index] = false;
            isSpreadCopy[index + 1] = true;
            setIsSpread(isSpreadCopy);

            const isAbleCopy = [...isAble];
            isAbleCopy[index] = false;
            isAbleCopy[index + 1] = true;
            setIsAble(isAbleCopy);

            const isCompleteCopy = [...isComplete];
            isCompleteCopy[index] = true;
            setIsComplete(isCompleteCopy);
        }

        if (index === transactions.pending.length - 1) {
            dispatch(deletePendingTransaction());
        }
    };

    const setTxHashHandler = (index: number, txHash: string) => {
        const temp = [...scanLink];
        const link = getScanLink(window.ethereum.chainId);
        temp[index] = link + txHash;
        setScanLink(temp);
    };

    const clickHandler = async (index: number) => {
        setIsLoading(index);

        const currentTx = transactions.pending[index];

        const remoteWallet = new RemoteWallet(window.ethereum);

        if (currentTx.actions.beforeAction) await currentTx.actions.beforeAction();
        const txHash = await remoteWallet.makeTransactionHash(currentTx.transactionData, {
            ...currentTx.actions,
            exceptionAction: (error: any) => {
                dispatch(deletePendingTransaction());

                if (currentTx.actions.exceptionAction) return currentTx.actions.exceptionAction(error);

                if (error.reason) window.toast('error', error.reason);
                else window.toast('error', error.message);
            },
        });

        if (!txHash) return;

        setTxHashHandler(index, txHash);
        await remoteWallet.sendTransaction(txHash, {
            beforeAction: currentTx.actions.beforeAction,
            afterAction: (receipt: TransactionReceipt) => {
                currentTx.actions.afterAction(receipt);

                nextHandler(index);
            },
            exceptionAction: (error) => {
                dispatch(deletePendingTransaction());
                if (currentTx.actions.exceptionAction) return currentTx.actions.exceptionAction(error);

                if (error.reason) window.toast('error', error.reason);
                else window.toast('error', error.message);
            },
        });
    };

    useEffect(() => {
        // initializing
        if (transactions.pending.length > 0) {
            setIsSpread([true, ...new Array(transactions.pending.length - 1).fill(false)]);
            setIsAble([true, ...new Array(transactions.pending.length - 1).fill(false)]);
            setClose(true);
        } else {
            setIsSpread([]);
            setIsAble([]);
            setIsComplete([]);
            setIsLoading(null);
            setScanLink([]);
            setClose(false);
        }
    }, [transactions.pending.length]);

    return (
        <Container>
            <div className="modalContainer">
                {close && (
                    <button className="close" onClick={() => dispatch(deletePendingTransaction())}>
                        <span>X</span>
                    </button>
                )}
                <div className="transactionModal">
                    {transactions.pending.map((item, index) => {
                        return (
                            <div key={index}>
                                <div
                                    className="header"
                                    style={index === 0 ? { borderRadius: '15px 15px 0 0' } : undefined}
                                >
                                    <span className="title">{item.title}</span>
                                    <div className="foldBtn" onClick={() => foldHandler(index)}>
                                        <div className="arrowCircle">
                                            {isSpread[index] ? (
                                                <ArrowDown width="16px" height="16px" color="#fff" />
                                            ) : (
                                                <ArrowUp width="16px" height="16px" color="#fff" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={`body ${isSpread[index] && 'spread'}`}>
                                    <div className="desc">
                                        <span className="grayF">{item.subTitle}</span>
                                    </div>

                                    <div className="pending">
                                        {isLoading === index && (
                                            <span className="grayF p">Waiting for Transaction...</span>
                                        )}
                                        {scanLink[index] && (
                                            <span className="red" onClick={() => window.open(scanLink[index])}>
                                                View on Etherscan
                                                <ArrowUpRightFromSquare width="16px" height="16px" color="#fff" />
                                            </span>
                                        )}
                                    </div>

                                    <div className="buttons">
                                        <button onClick={() => clickHandler(index)} disabled={!isAble[index]}>
                                            {Lang.CONFIRM}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {transactions.pending.length > 0 && <div className="modalBackShadow" />}
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    height: 100%;

    .modalContainer {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        max-height: 90%;
        height: fit-content;
        width: 35%;
        min-width: 280px;
        max-width: 360px;
        background-color: rgba(28, 27, 27, 0.901);

        z-index: 1001;
        border-radius: 15px;

        .transactionModal {
            width: 100%;
            height: 100%;
            position: relative;

            &.header:first-child {
                border-radius: 15px 15px 0 0;
            }

            .header {
                display: flex;
                justify-content: space-between;
                background: rgba(59, 59, 59, 0.4);
                padding: 18px;

                .title {
                    font-size: 18px;
                    color: #fff;
                    display: flex;
                    align-items: center;
                }

                .foldBtn {
                    cursor: pointer;
                    background: none;
                    display: flex;
                    align-items: center;

                    .arrowCircle {
                        width: 24px;
                        height: 24px;
                        transition: background-color 0.5s;
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        &:hover {
                            background-color: #4f4f4f;
                        }
                    }
                }
            }

            .body {
                overflow-y: scroll;
                -ms-overflow-style: none;

                &::-webkit-scrollbar {
                    display: none;
                }

                transform: translate3d(0, 50%, 0);
                transition:
                    opacity 1s,
                    transform 1s,
                    max-height 1.2s -0.5s;
                max-height: 0;
                opacity: 0;

                .desc {
                    padding: 16px;

                    p {
                        font-size: 16px;
                        color: #9d9d9d;
                        margin: 0 0 9px 0;
                    }
                }

                .pending {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    margin: 12px 0 2px;

                    .red {
                        margin-top: 4px;
                        cursor: pointer;
                        color: #d41002;
                        display: flex;
                        align-self: center;
                    }
                }

                .buttons {
                    padding: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    grid-gap: 6px;

                    button {
                        padding: 14px 24px;
                        backdrop-filter: blur(30px);
                        border-radius: 8px;
                        border: none;
                        width: 100%;

                        &:disabled {
                            cursor: auto;
                            opacity: 0.45;
                        }
                    }

                    button:first-child {
                        background: rgba(10, 10, 10, 0.6);
                        color: #9d9d9d;
                    }

                    button:last-child {
                        background: rgba(131, 14, 5, 0.6);
                        color: #ffffff;
                        transition: background 0.5s;

                        &:enabled:hover {
                            background: rgba(131, 14, 5);
                        }
                    }
                }
            }

            .body.spread {
                transition:
                    opacity 1s,
                    transform 1s,
                    max-height 3s;
                transform: translate3d(0, 0, 0);
                max-height: 100vh;
                opacity: 1;
            }
        }
    }

    .close {
        position: absolute;
        top: -30px;
        right: 5px;
        padding: 4px 10px;
        border-radius: 8px;
        background: rgba(59, 59, 59, 0.5);
        //border: 1px solid rgba(59, 59, 59, 0.805);
        transition: all 0.5s;

        &:hover {
            background: rgba(0, 0, 0, 0.65);
        }
    }

    .modalBackShadow {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100vw;
        z-index: 1000;
        background: rgba(0, 0, 0, 0.65);
    }
`;

export default TransactionModal;

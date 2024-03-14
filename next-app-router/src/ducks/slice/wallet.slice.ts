import { createSlice } from '@reduxjs/toolkit';
import { TransactionReceipt } from 'web3-types';

import { TransactionActions, TransactionObject } from '@/utils/contract/_base/RemoteWallet';

export interface Transaction {
    title: string; // transaction modal title
    subTitle: string; // transaction modal desc, 추후에 해당 포인트에 JSX 를 들고와서 진행중인 트랜잭션의 자세한 내용을 담아야함

    transactionData: TransactionObject;
    transactionHash?: string;
    receipt?: TransactionReceipt;

    actions: TransactionActions;
}

type WalletState = {
    transactions: {
        pending: Transaction[];
    };
};

const initialState: WalletState = {
    transactions: {
        pending: [],
    },
};

export const wallet = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        deletePendingTransaction: (state) => {
            state.transactions.pending = [];
        },
        putPendingTransaction: (state, action: { payload: { pending: Transaction[] } }) => {
            state.transactions.pending = action.payload.pending;
        },
    },
});

export const { deletePendingTransaction, putPendingTransaction } = wallet.actions;
export default wallet.reducer;

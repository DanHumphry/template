import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './slice/wallet.slice';
import globalReducer from './slice/global.slice';

export const store = configureStore({
    reducer: {
        walletReducer,
        globalReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

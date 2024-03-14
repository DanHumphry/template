import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LanguageKeys } from '@/utils/languages';

type InitialState = {
    language: LanguageKeys;
};

const initialState: InitialState = {
    language: LanguageKeys.en,
};

export const global = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<LanguageKeys>) => {
            let nextLang;

            if (action?.payload === undefined || action?.payload === null) {
                nextLang = LanguageKeys.en;
            } else {
                nextLang = action.payload;
            }

            state.language = nextLang;
            localStorage.setItem('vrwdLang', nextLang);
        },
    },
});

export const { setLanguage } = global.actions;
export default global.reducer;

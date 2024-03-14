import ko_KR from './ko_KR';
import en_US from './en_US';

export enum LanguageKeys {
    kr = 'ko-KR',
    en = 'en-US',
}

const obj = {
    [LanguageKeys.kr]: ko_KR,
    [LanguageKeys.en]: en_US,
};

export default obj;

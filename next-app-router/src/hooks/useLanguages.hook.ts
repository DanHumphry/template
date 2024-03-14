import languagePack from '@/utils/languages';

import { useSelector } from 'react-redux';
import { RootState } from '@/ducks/store';

/**
 * 현재 언어 설정에 따라 언어 팩을 반환합니다.
 * 브라우저에서 실행되는 경우 Redux 스토어에서 언어 설정을 검색합니다.
 * 브라우저 외부에서 실행되는 경우(예: Node.js) 기본적으로 영어('en-US')로 언어 팩을 반환합니다.
 *
 * @returns {Object} The language pack object containing translations for the current language.
 */
const useLanguages = () => {
    if (typeof window === 'undefined') return languagePack['en-US'];

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { language } = useSelector((store: RootState) => store.globalReducer);

    return languagePack[language] ?? languagePack['en-US'];
};

export default useLanguages;

import React from 'react';

const Lang = {
    CONNECT_WALLET: 'CONNECT WALLET',
    DISCONNECT_WALLET: 'DISCONNECT WALLET',
    CHANGE_NETWORK: 'Change Network',
    CONFIRM: 'CONFIRM',

    // 함수형 예시 (파라미터가 존재할 때 사용)
    EXAMPLE__FUNCTION(item: string, exp: string) {
        return (
            <span>
                {exp} Exp can be acquired with {item} Doping.
            </span>
        );
    },

    // 즉시실행함수 예시 (파라미터가 없어도 될 때 사용)
    EXAMPLE__FUNCTION__IIFE: (() => {
        return (
            <span>
                <span style={{ color: '#EE7070' }}>Exp Boosting</span> is now available!
            </span>
        );
    })(),
};

export default Lang;

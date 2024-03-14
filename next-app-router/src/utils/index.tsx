import { BigNumberish, ethers } from 'ethers';

export const formatEther = (wei: BigNumberish, decimal = 4): string => {
    return Number(ethers.formatEther(wei)).toFixed(decimal);
};

export const numberWithCommas = (number: number | string, unit?: string) => {
    const sliceDecimal = String(number).split('.');
    const num = sliceDecimal[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const decimal = sliceDecimal[1] ? `.${sliceDecimal[1]}${unit || ''}` : `${unit || ''}`;

    return num + decimal;
};

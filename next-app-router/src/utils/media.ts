import { css } from 'styled-components';

type DeviceType = 'desktop' | 'tablet' | 'phone';

const sizes: Record<DeviceType, number> = {
    desktop: 1200,
    tablet: 768,
    phone: 600,
};

const media = Object.entries(sizes).reduce((acc, [key, value]) => {
    return {
        ...acc,
        [key]: (first: TemplateStringsArray, ...interpolations: any[]) => css`
            @media (max-width: ${value}px) {
                ${css(first, ...interpolations)}
            }
        `,
    };
}, {}) as Record<DeviceType, any>;

// eslint-disable-next-line import/prefer-default-export
export default media;

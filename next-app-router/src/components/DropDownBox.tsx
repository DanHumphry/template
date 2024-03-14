import React, { useEffect, useState } from 'react';
import { css, styled } from 'styled-components';

import media from '@/utils/media';
import { ToastTypes } from '@/components/blocks/toasts/Toast';

const getToastBg = (type?: ToastTypes) => {
    switch (type) {
        case 'error':
            return css`
                background-color: #dc3545;
                color: #fff;
            `;
        case 'success':
            return css`
                background-color: #198754;
                color: #fff;
            `;
        case 'warning':
            return css`
                background-color: #ffc107;
                color: #212529;
            `;
        case 'noti':
            return css`
                background-color: #6c757d;
                color: #fff;
            `;
        default:
            return '';
    }
};

interface StyledButtonProps {
    width?: string;
    $minWidth?: string;
    height?: string;
    color?: string; // text color
    bgColor?: string; // background color
    padding?: string;
    top?: string;
    left?: string;
    right?: string;
    custom?: boolean;
    up?: boolean;
    spot?: boolean;
    mobile?: boolean;
    center?: boolean;
    none?: boolean;
    $toastType?: ToastTypes;
    $textAlign?: string;
    $borderRadius?: string;
    position?: string;
}

const Container = styled.div<StyledButtonProps>`
    z-index: 999 !important;
    width: ${(props) => (props.width ? props.width : 'auto')};
    min-width: ${(props) => (props.$minWidth ? props.$minWidth : 'auto')};
    height: ${(props) => (props.height ? props.height : '50px')};
    color: ${(props) => (props.color ? props.color : 'rgba(10, 10, 10, 0.60)')};
    background-color: ${(props) => (props.bgColor ? props.bgColor : 'gray')};
    padding: ${(props) => (props.padding ? props.padding : '14px')};
    backdrop-filter: blur(30px);
    border-radius: ${(props) => (props.$borderRadius ? props.$borderRadius : '14px')};
    text-align: ${(props) => (props.$textAlign ? props.$textAlign : 'auto')};
    position: ${(props) => (props.position ? props.position : 'absolute')};
    top: ${(props) => (props.top ? props.top : '50px')};
    left: ${(props) => (props.left ? props.left : '0')};
    right: ${(props) => props.right && props.right};

    ${(props) => getToastBg(props.$toastType)}

    animation: ${(props) => (props.custom ? 'fadeDownCenter 0.5s' : 'fadeDown 0.5s')};

    ${(props) =>
        props.none &&
        css`
            background: none;
            width: 0;
            height: 0;
            opacity: 0;
        `}

    ${(props) =>
        props.spot &&
        css`
            animation: opacity 1s;
        `}
    ${(props) =>
        props.center &&
        css`
            display: flex;
            justify-content: center;
            align-items: center;
            .children {
                width: 100%;
                margin: 0 10px;
            }
        `}

    ${(props) =>
        props.right &&
        css`
            left: initial;
            right: ${props.right};
            .children {
                height: 100%;
            }
        `}

    ${(props) =>
        props.custom &&
        css`
            left: 50%;
            transform: translate(-50%);
        `}

    ${(props) =>
        props.up &&
        css`
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: fadeIn 1s;
            .children {
                height: 100%;
            }
        `}

    ${(props) =>
        props.mobile &&
        css`
            ${media.phone`
                width: 360px;
                height: 175px;
                background: rgba(10, 10, 10, 0.877);
            `}
        `}
    
    
    
    @keyframes fadeDownCenter {
        0% {
            opacity: 0;
            transform: translateY(-100%) translateX(-50%);
        }
        to {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
        }
    }
    @keyframes fadeDown {
        0% {
            opacity: 0;
            transform: translateY(-100%);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    @keyframes fadeIn {
        0% {
            opacity: 0;
            transform: translate3d(0, 100%, 0) translateX(-50%);
        }
        to {
            opacity: 1;
            transform: translateZ(0) translateX(-50%, -50%);
        }
    }
    @keyframes opacity {
        0% {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .children {
        z-index: 999 !important;
        position: relative;
    }
`;

interface IProps {
    children?: React.ReactNode;
    padding?: string;
    borderRadius?: string;
    width?: string;
    minWidth?: string;
    height?: string;
    color?: string;
    top?: string;
    left?: string;
    up?: boolean;
    stay?: boolean;
    spot?: boolean;
    mobile?: boolean;
    right?: string;
    center?: boolean;
    textAlign: string;
    none?: boolean;
    toastType?: ToastTypes;
    position?: string;
}

const DropDownBox = ({
    children,
    color,
    padding,
    borderRadius,
    width,
    minWidth,
    height,
    top,
    left,
    right,
    up,
    stay,
    spot,
    mobile,
    center,
    none,
    toastType,
    textAlign,
    position,
}: IProps) => {
    const custom = left === '50%';

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (stay) return;
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [stay]);

    if (!visible) {
        return null;
    }

    return (
        <Container
            padding={padding}
            width={width}
            $minWidth={minWidth}
            height={height}
            color={color}
            top={top}
            left={left}
            right={right}
            custom={custom}
            up={up}
            spot={spot}
            mobile={mobile}
            center={center}
            none={none}
            $toastType={toastType}
            $textAlign={textAlign}
            $borderRadius={borderRadius}
            position={position}
        >
            <div className="children">{children}</div>
        </Container>
    );
};

export default DropDownBox;

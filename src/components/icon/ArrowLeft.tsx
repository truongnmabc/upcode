import React from "react";
import IconProps from "./IconProp";

const ArrowLeft = ({ color = "#262626", width = 16, height = 16 }: IconProps) => {
    return (
        <svg width={`${width}`} height={`${height}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M5.71435 2.59129L9.85404 6.73098C10.3429 7.21987 10.3429 8.01987 9.85404 8.50875L5.71435 12.6484"
                stroke={color}
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default ArrowLeft;

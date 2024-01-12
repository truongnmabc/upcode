import React from "react";
import IconProps from "./IconProp";

const ExpandMoreIcon = ({ color = "#212121", width = 16, height = 16 }: IconProps) => {
    return (
        <svg width={`${width}`} height={`${height}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="icon/navigation/expand_more_24px">
                <path
                    id="icon/navigation/expand_more_24px_2"
                    d="M10.5837 5.99968L7.99706 8.58634L5.41039 5.99968C5.28584 5.87484 5.11674 5.80469 4.94039 5.80469C4.76405 5.80469 4.59494 5.87484 4.47039 5.99968C4.21039 6.25968 4.21039 6.67968 4.47039 6.93968L7.53039 9.99968C7.79039 10.2597 8.21039 10.2597 8.47039 9.99968L11.5304 6.93968C11.7904 6.67968 11.7904 6.25968 11.5304 5.99968C11.2704 5.74634 10.8437 5.73968 10.5837 5.99968V5.99968Z"
                    fill={color}
                />
            </g>
        </svg>
    );
};

export default ExpandMoreIcon;

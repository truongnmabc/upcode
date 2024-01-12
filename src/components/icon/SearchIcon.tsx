import React from "react";
import IconProps from "./IconProp";

const SearchIcon = ({ color = "#262626", width = 20, height = 20 }: IconProps) => {
    return (
        <svg width={`${width}`} height={`${height}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Iconly/Light/Search">
                <g id="Search">
                    <circle
                        id="Ellipse_739"
                        cx="9.80492"
                        cy="9.80492"
                        r="7.49047"
                        stroke={color}
                        strokeOpacity="0.52"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        id="Line_181"
                        d="M15.0156 15.4043L17.9523 18.3334"
                        stroke={color}
                        strokeOpacity="0.52"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
            </g>
        </svg>
    );
};

export default SearchIcon;

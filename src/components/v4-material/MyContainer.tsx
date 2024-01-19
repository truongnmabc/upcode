import { CSSProperties } from "react";
import "./MyContainer.scss";
const MyContainer = ({ children, className, style }: { children?: any; className?: string; style?: CSSProperties }) => {
    return (
        <div className={`v4-container-component ${className} v4-container-maxWidth`} style={style}>
            {children}
        </div>
    );
};

export default MyContainer;

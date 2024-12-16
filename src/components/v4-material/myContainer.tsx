import { CSSProperties } from "react";
import "./MyContainer.scss";
import ctx from "@/utils/mergeClass";
const MyContainer = ({
    children,
    className,
    style,
}: {
    children?: any;
    className?: string;
    style?: CSSProperties;
}) => {
    return (
        <div
            className={ctx(
                "w-full block box-border mx-auto px-4 sm:px-6 xl:max-w-[1280px]",
                className
            )}
            style={style}
        >
            {children}
        </div>
    );
};

export default MyContainer;

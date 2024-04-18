import { useEffect, useRef } from "react";
import "./MyCollapse.scss";
const MyCollapse = ({ children, expand }: { children: JSX.Element; expand: boolean }) => {
    const ref = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (expand) {
            ref.current.style.height = contentRef.current.clientHeight + "px";
        } else {
            ref.current.style.height = "0px";
        }
    }, [expand]);
    return (
        <div className={"v4-my-collapse-container "} ref={ref}>
            <div ref={contentRef}>{children}</div>
        </div>
    );
};
export default MyCollapse;

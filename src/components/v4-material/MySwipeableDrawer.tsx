import { useEffect, useRef, useState } from "react";
import "./MySwipeableDrawer.scss";
import { createPortal } from "react-dom";
const MySwipeableDrawer = ({
    children,
    open,
    onClose,
    className = "",
}: {
    children: any;
    // Icon?: (args: HTMLAttributes<HTMLElement>) => JSX.Element;
    className?: string;
    open: boolean;
    onClose: () => void;
}) => {
    const [mount, setMount] = useState<any>();
    useEffect(() => {
        if (typeof document !== "undefined") {
            setMount(document.body);
        }
    }, []);
    return mount ? (
        <>
            {createPortal(
                <_Drawer open={open} onClose={onClose} className={className}>
                    {children}
                </_Drawer>,
                mount
            )}
        </>
    ) : (
        <></>
    );
};
const _Drawer = ({
    children,
    open,
    onClose,
    className = "",
}: {
    children: any;
    // Icon?: (args: HTMLAttributes<HTMLElement>) => JSX.Element;
    className?: string;
    open: boolean;
    onClose: () => void;
}) => {
    const drawer = useRef<HTMLDivElement>(null);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [drawerWidth, setDrawerWidth] = useState(0);
    const presentation = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let nextEle = document.getElementById("__next");
        if (!!nextEle) {
            if (drawer.current) {
                if (open) {
                    setContainer(true);
                    drawer.current.className = "open";
                    drawer.current.style.transform = "translate(calc(-100vw - 25px + 30px), 0)"; // giống bên css
                    document.body.style.overflow = "hidden";
                    nextEle.style.height = "-webkit-fill-available"; // chu y cho nay
                    nextEle.style.overflow = "hidden";
                } else {
                    setContainer(false);
                    drawer.current.className = "";
                    drawer.current.style.transform = "translate(0, 0)"; // giống bên css
                    document.body.style.overflow = "unset";
                    nextEle.style.height = "100%";
                    nextEle.style.overflow = "";
                }
            }
            return () => {
                nextEle && (nextEle.style.height = "100%");
                nextEle && (nextEle.style.overflow = "");
                document.body.style.overflow = "unset";
            };
        }
    }, [open]);

    const setContainer = (active: boolean) => {
        let container = document.getElementById("_blank");
        if (container) {
            container.style.right = active ? "0" : "-100vw";
            container.style.backgroundImage = active
                ? "linear-gradient(to right, transparent, rgba(33, 33, 33, 0.3))"
                : "rgba(33, 33, 33, 0.0)";
        }
    };
    return (
        <div className="presentation-drawer-right" ref={presentation}>
            <div
                id="_blank"
                onClick={() => {
                    onClose();
                }}
            ></div>
            <div
                ref={drawer}
                id="navigation_drawer"
                onTouchStart={(e) => {
                    const touch = e.targetTouches[0];
                    setStartPos({ x: touch.pageX, y: touch.pageY });
                    if (drawer.current) setDrawerWidth(drawer.current.offsetWidth);
                }}
                onTouchEnd={(e) => {
                    const touch = e.changedTouches[0];
                    if (drawer.current) {
                        drawer.current.style.transition = "transform 0.3s 0s cubic-bezier(0.55, 0, 0.1, 1)";
                        if (touch.pageX - startPos.x >= drawerWidth * 0.32) {
                            // Close drawer
                            drawer.current.className = "";
                            drawer.current.style.transform = "";
                            onClose();
                        } else {
                            //swipe một ít rồi thả ra chưa đủ để đóng thì phải mở lại
                            drawer.current.style.transform = "translate(calc(-100vw - 25px + 30px), 0)"; // giống bên css
                        }
                    }
                }}
                onTouchMove={(e) => {
                    const touch = e.targetTouches[0];
                    if (touch.pageX > startPos.x && presentation.current && drawer.current) {
                        // Set correct transforms
                        let position = Math.min(
                            30 - 25 - presentation.current.offsetWidth + touch.pageX - startPos.x,
                            30 + drawerWidth - presentation.current.offsetWidth
                        );
                        drawer.current.style.transition = "none";
                        drawer.current.style.transform = `translate(${position}px, 0)`;
                    }
                }}
            >
                <div className={className}> {children}</div>
            </div>
        </div>
    );
};

export default MySwipeableDrawer;

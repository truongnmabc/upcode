import "./MySwipeDownDrawer.scss";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
const MySwipeDownDrawer = ({
    children,
    open,
    onClose,
    anchor = "right",
    className = "",
}: {
    children: any;
    // Icon?: (args: HTMLAttributes<HTMLElement>) => JSX.Element;
    className?: string;
    open: boolean;
    onClose: () => void;
    anchor?: "top" | "left" | "right" | "bottom";
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
                <_Drawer open={open} onClose={onClose} anchor={anchor} className={className}>
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
    anchor = "right",
    className = "",
}: {
    children: any;
    // Icon?: (args: HTMLAttributes<HTMLElement>) => JSX.Element;
    className?: string;
    open: boolean;
    onClose: () => void;
    anchor?: "top" | "left" | "right" | "bottom";
}) => {
    const drawer = useRef<HTMLDivElement>(null);
    const presentation = useRef<HTMLDivElement>(null);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [drawerHeight, setDrawerHeight] = useState(0);
    useEffect(() => {
        if (open) {
            setContainer(true);
            drawer.current.className = "open";
            drawer.current.style.transform = "translate( 0,calc(-100vh - 25px + 30px))"; // giống bên css
            // document.getElementById("__next").style.height = "-webkit-fill-available"; // chu y cho nay
            document.getElementById("__next").style.overflow = "hidden";
            // document.body.style.overflow = "hidden";
            presentation.current.style.zIndex = "1200";
        } else {
            setContainer(false);
            drawer.current.className = "";
            drawer.current.style.transform = "translate(0, 0)"; // giống bên css
            // document.body.style.overflow = "unset";
            // document.getElementById("__next").style.height = "100%";
            document.getElementById("__next").style.overflow = "auto";
            setTimeout(() => {
                if (presentation?.current?.style) presentation.current.style.zIndex = "-9999";
            }, 300);
        }
        return () => {
            // document.getElementById("__next").style.height = "100%";
            document.getElementById("__next").style.overflow = "auto";
            // document.body.style.overflow = "unset";
        };
    }, [open]);

    const setContainer = (active: boolean) => {
        let container = document.getElementById("_blank_drawer_bottom");
        container.style.bottom = active ? "0" : "-100vh";
        container.style.backgroundImage = active
            ? "linear-gradient(to bottom, transparent, rgba(33, 33, 33, 0.5))"
            : "rgba(33, 33, 33, 0.0)";
    };
    return (
        <div className="presentation-drawer-bottom" ref={presentation}>
            <div
                id="_blank_drawer_bottom"
                onClick={(e) => {
                    onClose();
                }}
            ></div>
            <div
                ref={drawer}
                id="navigation_drawer_bottom"
                onTouchStart={(e) => {
                    const touch = e.targetTouches[0];
                    setStartPos({ x: touch.pageX, y: touch.pageY });
                    setDrawerHeight(drawer.current.offsetHeight);
                }}
                onTouchEnd={(e) => {
                    const touch = e.changedTouches[0];
                    drawer.current.style.transition = "transform 0.3s 0s cubic-bezier(0.55, 0, 0.1, 1)";
                    if (touch.pageY - startPos.y >= drawerHeight * 0.5) {
                        // Close drawer
                        drawer.current.className = "";
                        drawer.current.style.transform = "";
                        onClose();
                    } else {
                        //swipe một ít rồi thả ra chưa đủ để đóng thì phải mở lại
                        drawer.current.style.transform = "translate(0, calc(-100vh - 25px + 30px))"; // giống bên css
                    }
                }}
                onTouchMove={(e) => {
                    const touch = e.targetTouches[0];
                    if (touch.pageY > startPos.y) {
                        // Set correct transforms
                        let position = Math.min(
                            30 - 25 - presentation.current.offsetHeight + touch.pageY - startPos.y,
                            30 + drawerHeight - presentation.current.offsetHeight
                        );
                        drawer.current.style.transition = "none";
                        drawer.current.style.transform = `translate(0, ${position}px)`;
                    }
                }}
            >
                <div className={className}> {children}</div>
            </div>
        </div>
    );
};

export default MySwipeDownDrawer;

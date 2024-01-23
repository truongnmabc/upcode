import { useEffect, useState } from "react";
import "./ScrollToTopArrow.scss";
const ScrollToTopArrow = () => {
    const [showBtn, setScrollToTop] = useState(false);
    const [stick, setStick] = useState(false);
    // const isHomePage = useSelector(
    //     (state: AppState) => state.studyV2State.isHomePage
    // );
    useEffect(() => {
        typeof window !== "undefined" && window.addEventListener("scroll", showScrollToTopArrow);

        return () => {
            window.removeEventListener("scroll", showScrollToTopArrow);
        };
    }, []);

    const showScrollToTopArrow = () => {
        const { scrollHeight, scrollTop, clientHeight, clientWidth } = document.documentElement;
        const stickHeight = clientWidth < 768 ? 500 : 675;
        setStick(scrollHeight - (scrollTop + clientHeight) <= stickHeight);
        setScrollToTop(scrollTop > 300);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    if (!showBtn) {
        return <></>;
    }

    return (
        <div className={`al-support-scroll`} onClick={() => scrollToTop()}>
            <div className="tt">
                <ArrowIconV2Svg />
            </div>
        </div>
    );
};

const ArrowIconV2Svg = () => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12.6673L8 3.33398" stroke="#212121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M3.33268 8.00065L7.99935 3.33398L12.666 8.00065"
                stroke="#212121"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default ScrollToTopArrow;

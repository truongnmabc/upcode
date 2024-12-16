import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import { convertTime } from "../../utils";
import "./V0ProDiscountDrawer.scss";
import MyContainer from "@/components/v4-material/myContainer";
import dynamic from "next/dynamic";
const Drawer = dynamic(() => import("@mui/material/Drawer"));

const V0ProDiscountDrawer = ({
    onClickGetPro,
    open,
    setOpen,
    saleIndex,
    prices,
}: {
    onClickGetPro: any;
    open: boolean;
    setOpen: any;
    saleIndex: number;
    prices: any[];
}) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [time, setTime] = useState(0);
    const SALE_INDEX = saleIndex;
    const { savePrice, price, type } = prices[SALE_INDEX]; //getConfigProV2(appInfo)?.prices[SALE_INDEX];

    useEffect(() => {
        const KEY = "DISCOUNT_TIME";
        const NEW_TIME = 60 * 60 * 16;
        const timeFromStorage = parseInt(localStorage.getItem(KEY));
        const timeLeft = isNaN(timeFromStorage) ? NEW_TIME : timeFromStorage;
        if (timeLeft < 0) {
            setOpen(false);
            return;
        }
        localStorage.setItem(KEY, timeLeft.toString());
        setTime(timeLeft);

        const timer = setInterval(() => {
            const timeFromStorage = parseInt(localStorage.getItem(KEY));
            let timeLeft = isNaN(timeFromStorage) ? NEW_TIME : timeFromStorage;
            timeLeft -= 1;
            if (timeLeft < 0) {
                setOpen(false);
                return;
            }
            localStorage.setItem(KEY, timeLeft.toString());
            setTime(timeLeft);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="discount-drawer-section">
            {SALE_INDEX > 0 && (
                <Drawer
                    open={open}
                    hideBackdrop
                    anchor={"bottom"}
                    variant="persistent"
                    transitionDuration={500}
                >
                    <div className="background-discount">
                        <MyContainer className="container">
                            <div className="left">
                                <img
                                    src="/images/passemall/new-pro/girl-smile.png"
                                    alt="smile"
                                />
                                {!isMobile && (
                                    <div className="text-discount">
                                        Save{" "}
                                        <span className="percent">
                                            <b>{savePrice?.percent}%</b>
                                        </span>{" "}
                                        - Only <b>${price}</b> For {type}
                                    </div>
                                )}
                            </div>
                            <div className="right">
                                {isMobile && (
                                    <div className="text-discount">
                                        Save{" "}
                                        <span className="percent">
                                            <b>{savePrice?.percent}%</b>
                                        </span>{" "}
                                        - Only <b>${price}</b> For {type}
                                    </div>
                                )}
                                <div className="content">
                                    <div className="timer">
                                        <span className="limited">
                                            Limited offer
                                        </span>
                                        {convertTime(time)}
                                    </div>
                                    <button
                                        className="button-update"
                                        onClick={() =>
                                            onClickGetPro(SALE_INDEX)
                                        }
                                    >
                                        Upgrade Now
                                    </button>
                                </div>
                            </div>
                        </MyContainer>
                    </div>
                </Drawer>
            )}
        </div>
    );
};

export default V0ProDiscountDrawer;

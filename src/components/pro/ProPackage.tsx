import React, { useEffect, useState } from "react";
import "./ProPackage.scss";
import useMediaQuery from "@mui/material/useMediaQuery";
import MyContainer from "../v4-material/MyContainer";
import V4CircleProgress from "../v4-material/V4CircleProgress";
import V0ProDiscountDrawer from "./V0ProDiscountDrawer";

/** Component này áp dụng cho trường hợp không phải one-time */
const ProPackage = ({
    handleClickGetPro,
    loading,
    prices,
}: {
    handleClickGetPro: (index: number) => void;
    loading: boolean;
    prices: any[];
}) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    let dataConfigPro = prices;
    const [active, setActive] = useState(1);
    const [openDiscountDrawer, setOpenDiscountDrawer] = useState(false);
    useEffect(() => {
        const el = document.querySelector("#text-save-price");
        if (el) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setOpenDiscountDrawer(false);
                        return;
                    }
                    const KEY = "DISCOUNT_TIME";
                    const timeFromStorage = parseInt(localStorage.getItem(KEY));
                    if (!isNaN(timeFromStorage) && timeFromStorage > 0) {
                        setOpenDiscountDrawer(true);
                    }
                },
                {
                    root: null,
                    threshold: 1,
                }
            );
            observer.observe(el);
        }
    }, []);

    return (
        <>
            <div className="app-pro-package">
                <MyContainer className="pro-package">
                    {dataConfigPro.map((price, i) => (
                        <PriceItem
                            price={price}
                            key={i}
                            active={i === active}
                            handleActive={() => setActive(i)}
                            isMobile={isMobile}
                        />
                    ))}
                </MyContainer>
                <div
                    className="upgrade-btn v4-button-animtaion"
                    onClick={() => {
                        if (!loading) handleClickGetPro(active);
                    }}
                >
                    Upgrade Now {loading && <V4CircleProgress size={16} thickness={2} />}
                </div>
            </div>
            <V0ProDiscountDrawer
                // appInfo={appInfo}
                onClickGetPro={(index: number) => {
                    handleClickGetPro(index);
                }}
                open={openDiscountDrawer}
                setOpen={setOpenDiscountDrawer}
                saleIndex={active}
                prices={prices}
            />
        </>
    );
};
const PriceItem = ({ price, active = false, handleActive, isMobile }) => {
    const { price: salePrice, initPrice, type, averagePrice, trialDay, savePrice } = price;
    return (
        <div className={`price-item ${active ? "active" : ""}`} onClick={handleActive}>
            {active && (
                <div className="icon-check">
                    <img src="./images/passemall/new-pro/check-price.png" alt="icon-check" />
                </div>
            )}
            {isMobile ? (
                <>
                    <div className={"text-save-price " + (active ? "active" : "")} id="text-save-price">
                        {savePrice?.text && <div className="text">{savePrice?.text}</div>}
                    </div>
                    <div className="price-item-container">
                        <div className="price-section">
                            <span className="sale-price">${salePrice}</span>
                        </div>
                        <div className="type">{type}</div>
                        <div className="divide"></div>
                        <div className="average-price">
                            Just <b>${averagePrice} </b>
                        </div>
                        <div className="day">Per Day</div>
                        <div className="trial-day">
                            {trialDay && (
                                <>
                                    {trialDay}-day <b>FREE</b> trial
                                </>
                            )}
                        </div>
                    </div>
                    {savePrice?.text && <div className="percent-save-price">Save {savePrice?.percent} %</div>}
                </>
            ) : (
                <>
                    <div className="price-item-container">
                        <div className="price-section">
                            <span className="sale-price" id="text-save-price">
                                ${salePrice}{" "}
                            </span>
                            {initPrice && <span className="current-price">${initPrice}</span>}
                        </div>
                        <div className="type">{type}</div>
                        <div className="divide"></div>
                        <div className="average-price">
                            Just <b>${averagePrice} </b>
                            <span className="day">per Day</span>
                        </div>
                        <div className="trial-day">
                            {trialDay && (
                                <>
                                    {trialDay}-day <b>FREE</b> trial
                                </>
                            )}
                        </div>
                    </div>
                    <div className="save-price">
                        {savePrice?.text && (
                            <div className="save-price-container">
                                <div className="text">{savePrice?.text}</div>
                                <div className="save-percent">
                                    Save <span className="percent">{savePrice?.percent}</span>%
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
export default ProPackage;

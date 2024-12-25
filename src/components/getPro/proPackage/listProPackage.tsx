"use client";
import { MtUiButton } from "@/components/button";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import { getConfigProV2 } from "@/utils/config_paypal";
import "./ProPackage.scss";
import LazyLoadImage from "@/components/images";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { userState } from "@/redux/features/user";
import V0ProDiscountDrawer from "@/components/pro/V0ProDiscountDrawer";
import { useRouter } from "next/navigation";
import { ONETIME, SUBSCRIPTION } from "@/config/config_paypal";
import { revertPathName } from "@/utils/pathName";
import RouterApp from "@/common/router/router.constant";
import Config from "@/config";
import PopupGetPro, { IButtonPropsV4 } from "@/components/pro/PopupGetPro";
import { useSession } from "next-auth/react";
import ModalLogin from "@/components/login";
import { getListTransactionAPI } from "@/services/paypal.service";
import { isSubscriptionId } from "@/models/payment/PaymentInfo";

const ProPackage = () => {
    const { appInfo } = useAppSelector(appInfoState);
    const isMobile = useIsMobile();
    const { prices, type } = getConfigProV2(appInfo);
    const { data: session } = useSession();
    const { userInfo, paymentInfo } = useAppSelector(userState);
    const [active, setActive] = useState(1);
    const [openDiscountDrawer, setOpenDiscountDrawer] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [orderInfo, setOrderInfo] = useState<any>(null);

    const [valueButton, setValueButton] = useState<IButtonPropsV4 | null>(null);
    console.log("🚀 ~ ProPackage ~ valueButton:", valueButton);

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

    useEffect(() => {
        const getBilling = async () => {
            if (
                paymentInfo?.orderId &&
                isSubscriptionId(paymentInfo?.orderId) &&
                type === SUBSCRIPTION
            ) {
                let { orderInfo } = await getListTransactionAPI(
                    paymentInfo.orderId,
                    paymentInfo?.orderIds?.filter((id) => id) ?? []
                );
                setOrderInfo(orderInfo);
            }
        };

        getBilling();
    }, [paymentInfo?.orderId]);

    const router = useRouter();
    const handleClickGetPro = (index: number) => {
        // đã gọi vào đây tức là gói được chọn là có thể mua
        // let ga_Action = "";
        // if (index == 0) ga_Action = "select_basic_plan";
        // else if (index == 1) ga_Action = "select_pop_plan";
        // else if (index == 2) ga_Action = "select_eco_plan";
        // ga.event({
        //     action: ga_Action,
        //     params: {
        //         appName: appInfo.appName,
        //     },
        // });
        // ga.event({
        //     action: "click_upgrade",
        //     params: {
        //         appName: appInfo.appName,
        //     },
        // });

        const _href = revertPathName({
            appName: appInfo.appShortName,
            href: RouterApp.Billing,
        });

        let stateValue = "buyPro";
        if (!session) {
            setOpenModal(true);
            return;
        }

        if (type === ONETIME) {
            if (paymentInfo?.buyPro === Config.PURCHASED) {
                router.push(_href);
                return;
            }
        } else {
            let orderIndex = prices.findIndex(
                (p) => p.planId === orderInfo?.plan_id
            );
            if (orderIndex > -1 && index <= orderIndex) {
                // nếu đã từng mua rồi thì chuyển sang trang billing
                window.location.href = "/billing";
                return;
            }
        }
        let planId = "";
        const configNewPro = prices[index];
        let price = configNewPro?.price;
        planId = configNewPro?.planId;
        let currentPrice = 0;
        currentPrice = price;
        setValueButton({
            price: currentPrice + "",
            value: currentPrice,
            stateValue: stateValue,
            isPdf: false,
            mainTitlePopUp: "Unlock all Features",
            planId,
            index,
        });
    };
    return (
        <div className="app-pro-package">
            <div className="max-w-page mx-auto w-full">
                <div className="flex items-center justify-center">
                    {prices.map((price, i) => (
                        <PriceItem
                            price={price}
                            key={i}
                            active={i === active}
                            handleActive={() => setActive(i)}
                            isMobile={isMobile}
                        />
                    ))}
                </div>
            </div>
            <div className="flex items-center mt-6 justify-center w-full">
                <MtUiButton
                    className="text-white font-bold text-base text-center upgrade-btn v4-button-animtaion"
                    style={{
                        background:
                            "linear-gradient(93.11deg, #0bb177 0.93%, #3b6b5a 100%)",
                    }}
                    onClick={() => {
                        handleClickGetPro(active);
                    }}
                >
                    Upgrade Now
                </MtUiButton>
            </div>

            {/* <V0ProDiscountDrawer
                onClickGetPro={(index: number) => {
                    handleClickGetPro(index);
                }}
                open={openDiscountDrawer}
                setOpen={setOpenDiscountDrawer}
                saleIndex={active}
                prices={prices}
            /> */}
            {valueButton && session && (
                <PopupGetPro
                    appInfo={appInfo}
                    onClose={() => {
                        setValueButton(null);
                    }}
                    valueButton={valueButton}
                />
            )}

            <ModalLogin open={openModal} setOpen={setOpenModal} />
        </div>
    );
};

const PriceItem = ({ price, active = false, handleActive, isMobile }) => {
    const {
        price: salePrice,
        initPrice,
        type,
        averagePrice,
        trialDay,
        savePrice,
    } = price;
    return (
        <div
            className={`price-item ${active ? "active" : ""}`}
            onClick={handleActive}
        >
            {active && (
                <div className="icon-check">
                    <LazyLoadImage
                        src="/images/passemall/new-pro/check-price.png"
                        alt="icon-check"
                    />
                </div>
            )}
            {isMobile ? (
                <>
                    <div
                        className={
                            "text-save-price " + (active ? "active" : "")
                        }
                        id="text-save-price"
                    >
                        {savePrice?.text && (
                            <div className="text">{savePrice?.text}</div>
                        )}
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
                                    {trialDay}-days <b>FREE</b> trial
                                </>
                            )}
                        </div>
                    </div>
                    {savePrice?.text && (
                        <div className="percent-save-price">
                            Save {savePrice?.percent} %
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="price-item-container">
                        <div className="price-section">
                            <span className="sale-price" id="text-save-price">
                                ${salePrice}{" "}
                            </span>
                            {initPrice && (
                                <span className="current-price">
                                    ${initPrice}
                                </span>
                            )}
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
                                    {trialDay}-days <b>FREE</b> trial
                                </>
                            )}
                        </div>
                    </div>
                    <div className="save-price">
                        {savePrice.text && (
                            <div className="save-price-container">
                                <div className="text">{savePrice?.text}</div>
                                <div className="save-percent">
                                    Save{" "}
                                    <span className="percent">
                                        {savePrice?.percent}
                                    </span>
                                    %
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

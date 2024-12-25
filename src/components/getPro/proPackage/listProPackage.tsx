"use client";
import RouterApp from "@/common/router/router.constant";
import { MtUiButton } from "@/components/button";
import ModalLogin from "@/components/login";
import { IButtonPropsV4 } from "@/components/pro/PopupGetPro";
import Config from "@/config";
import { ONETIME, SUBSCRIPTION } from "@/config/config_paypal";
import { isSubscriptionId } from "@/models/payment/PaymentInfo";
import { appInfoState } from "@/redux/features/appInfo";
import { userState } from "@/redux/features/user";
import { useAppSelector } from "@/redux/hooks";
import { getListTransactionAPI } from "@/services/paypal.service";
import { getConfigProV2, IPriceConfig } from "@/utils/config_paypal";
import { revertPathName } from "@/utils/pathName";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PopupGetProPayment from "../popup/popupGetPro";
import ItemPrice from "./itemPrice";
import "./ProPackage.scss";

const ProPackage = () => {
    const { appInfo } = useAppSelector(appInfoState);
    const { prices, type } = getConfigProV2(appInfo);
    const { data: session } = useSession();
    const { userInfo, paymentInfo } = useAppSelector(userState);
    const [active, setActive] = useState(1);
    // const [openDiscountDrawer, setOpenDiscountDrawer] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [orderInfo, setOrderInfo] = useState<any>(null);

    const [valueButton, setValueButton] = useState<IButtonPropsV4 | null>(null);
    console.log("🚀 ~ ProPackage ~ valueButton:", valueButton);

    // useEffect(() => {
    //     const el = document.querySelector("#text-save-price");
    //     if (el) {
    //         const observer = new IntersectionObserver(
    //             ([entry]) => {
    //                 if (entry.isIntersecting) {
    //                     setOpenDiscountDrawer(false);
    //                     return;
    //                 }
    //                 const KEY = "DISCOUNT_TIME";
    //                 const timeFromStorage = parseInt(localStorage.getItem(KEY));
    //                 if (!isNaN(timeFromStorage) && timeFromStorage > 0) {
    //                     setOpenDiscountDrawer(true);
    //                 }
    //             },
    //             {
    //                 root: null,
    //                 threshold: 1,
    //             }
    //         );
    //         observer.observe(el);
    //     }
    // }, []);

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
        if (!session) {
            setOpenModal(true);
            return;
        }
        const _href = revertPathName({
            appName: appInfo.appShortName,
            href: RouterApp.Billing,
        });

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
                router.push(_href);
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
            stateValue: "buyPro",
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
                        <ItemPrice
                            price={price as IPriceConfig}
                            key={i}
                            active={i === active}
                            handleActive={() => setActive(i)}
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
                <PopupGetProPayment
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

export default ProPackage;

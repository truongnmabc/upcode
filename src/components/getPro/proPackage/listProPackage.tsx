"use client";
import RouterApp from "@/common/router/router.constant";
import { MtUiButton } from "@/components/button";
import ModalLogin from "@/components/login";
import Config from "@/config";
import { ONETIME, SUBSCRIPTION } from "@/config/config_paypal";

import { useAppSelector } from "@/redux/hooks";
import { getListTransactionAPI } from "@/services/paypal.service";
import { getConfigProV2, IPriceConfig } from "@/utils/config_paypal";
import { revertPathName } from "@/utils/pathName";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import PopupGetProPayment from "../popup/popupGetPro";
import ItemPrice from "./itemPrice";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { selectPaymentInfo } from "@/redux/features/payment.reselect";
import "./ProPackage.scss";

const ProPackage = () => {
    const appInfo = useAppSelector(selectAppInfo);
    const paymentInfo = useAppSelector(selectPaymentInfo);
    const { data: userInfo } = useSession();
    const [active, setActive] = useState<IPriceConfig | null>(null);
    const router = useRouter();
    const [prices, setPrices] = useState<IPriceConfig[]>([]);
    const [type, setType] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [orderInfo, setOrderInfo] = useState<any>(null);
    const [openModalUpgrade, setOpenModalUpgrade] = useState(false);

    useEffect(() => {
        if (appInfo) {
            const { prices, type } = getConfigProV2(appInfo);
            setPrices(prices);
            setActive(prices[1]);
            setType(type);
        }
    }, [appInfo]);

    // useEffect(() => {
    //     const getBilling = async () => {
    //         if (
    //             paymentInfo?.orderId &&
    //             isSubscriptionId(paymentInfo?.orderId) &&
    //             type === SUBSCRIPTION
    //         ) {
    //             let { orderInfo } = await getListTransactionAPI(
    //                 paymentInfo.orderId,
    //                 paymentInfo?.orderIds?.filter((id) => id) ?? []
    //             );
    //             setOrderInfo(orderInfo);
    //         }
    //     };

    //     getBilling();
    // }, [paymentInfo?.orderId]);

    const handleClickGetPro = useCallback(() => {
        if (!userInfo) {
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
        }

        // *NOTE: Kiêm tra xem đã mua chưa
        // const orderIndex = prices.findIndex(
        //     (p) => p.planId === orderInfo?.plan_id
        // );
        // if (orderIndex > -1 && index <= orderIndex) {
        //     // nếu đã từng mua rồi thì chuyển sang trang billing
        //     router.push(_href);
        //     return;
        // }
        setOpenModalUpgrade(true);
    }, [active, userInfo, paymentInfo]);

    const handleClose = useCallback(() => setOpenModalUpgrade(false), []);
    return (
        <div className="app-pro-package">
            <div className="max-w-page mx-auto w-full">
                <div className="flex items-center justify-center">
                    {prices.map((price, i) => (
                        <ItemPrice
                            price={price as IPriceConfig}
                            key={i}
                            active={
                                active && price.planId === active.planId
                                    ? true
                                    : false
                            }
                            handleActive={() => setActive(price)}
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
                    onClick={handleClickGetPro}
                >
                    Upgrade Now
                </MtUiButton>
            </div>

            {openModalUpgrade && userInfo && active && (
                <PopupGetProPayment
                    appInfo={appInfo}
                    onClose={handleClose}
                    valueButton={active}
                />
            )}
            <ModalLogin open={openModal} setOpen={setOpenModal} />
        </div>
    );
};

export default ProPackage;

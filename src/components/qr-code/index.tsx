import QRCode from "qrcode.react";
import React, { useEffect, useState } from "react";

import { IAppInfo } from "@/models/AppInfo";
import { isProduction } from "@/config/config_web";
import Routes from "@/config/routes";
const QRCodeComponent = ({ isParentApp, appInfo }: { isParentApp?: boolean; appInfo?: IAppInfo }) => {
    const [valueQR, setValueQR] = useState("");
    useEffect(() => {
        if (typeof window != "undefined") {
            if (!isParentApp) {
                setValueQR(
                    (isProduction() ? window.location.origin : "http://192.168.2.208:3006") +
                        Routes.QR_CODE_REDIRECT +
                        (appInfo.appNameId ? "?appNameId=" + appInfo.appNameId : "")
                );
            }
        }
    }, []);
    return <QRCode value={valueQR} renderAs="svg"></QRCode>;
};

export default QRCodeComponent;

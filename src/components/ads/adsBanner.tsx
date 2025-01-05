import ctx from "@/utils/mergeClass";
import React, { useEffect } from "react";
import BtnRemove from "./btnRemove";
import Config from "@/config";
import "./index.css";

const countClickAds = () => {
    const clickAds = localStorage.getItem(Config.KEY_CLICK_ADS);
    let totalClick = 0;
    if (clickAds) {
        try {
            totalClick = parseInt(clickAds);
        } catch (error) {
            console.log("🚀 ~ countClickAds ~ error:", error);
        }
    }
    totalClick++;
    localStorage.setItem(Config.KEY_CLICK_ADS, totalClick + "");

    if (totalClick >= Config.MAX_CLICK_ADS_PER_USER) {
        window.location.reload();
    }
};

const AdsBanner = ({
    clientId,
    slotId,
    styles,
    className,
    responsive,
    wrapperClassName,
}: {
    clientId: string;
    slotId: string;
    styles: React.CSSProperties;
    className: string;
    responsive?: boolean;
    wrapperClassName?: string;
}) => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.log(err);
        }
    }, []);

    return (
        <div className={wrapperClassName} onClick={countClickAds}>
            <ins
                className={ctx("adsbygoogle", className)}
                style={styles}
                data-ad-client={clientId}
                data-ad-slot={slotId}
                data-full-width-responsive={responsive}
            />
            <BtnRemove />
        </div>
    );
};

export default AdsBanner;

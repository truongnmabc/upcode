import { useDetectAdBlock } from "adblock-detect-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import IWebData from "@/types/webData";
import { SYNC_TYPE } from "@/config/config_sync";
const Dialog = dynamic(() => import("@mui/material/Dialog"), { ssr: false });

const CheckAdsBlocker = ({ webData, upgradedPro }: { webData: IWebData; upgradedPro: boolean }) => {
    const adBlockDetected = useDetectAdBlock();
    const [showPopUpDetectAdsBlock, setShowPopUpDetectAdsBlock] = useState(false);
    useEffect(() => {
        console.log("adBlockDetected ", adBlockDetected);
        if (adBlockDetected && webData?.type == SYNC_TYPE.TYPE_LEARN_TEST) {
            // let timesLearn = 0;
            // let t = localStorage.getItem("access_study");
            // if (!!t) {
            //     timesLearn = parseInt(t);
            //     localStorage.setItem("access_study", timesLearn + 1 + "");
            // } else {
            //     localStorage.setItem("access_study", "1");
            // }
            if (!upgradedPro) {
                // trang học thôi nha
                setShowPopUpDetectAdsBlock(true);
            }
        }
    }, [adBlockDetected]);
    return (
        showPopUpDetectAdsBlock && (
            <Dialog
                open={true}
                sx={{
                    ".MuiDialog-container ": {
                        display: "block",
                    },
                    ".MuiDialog-paper": {
                        borderRadius: "20px",
                        padding: "16px",
                        maxWidth: "560px",
                    },
                }}
            >
                <div
                    style={{
                        fontSize: "18px",
                        fontWeight: "500",
                        lineHeight: "25px",
                        textAlign: "center",
                        marginTop: "16px",
                    }}
                >
                    We see you’re using an ad blocker
                </div>
                <span
                    style={{
                        fontSize: "14px",
                        lineHeight: "18px",
                        textAlign: "center",
                        marginTop: "28px",
                        color: "#6E6E70",
                    }}
                >
                    Please help us continue to provide free, quality contents by disabling your ad blocker
                </span>
                <div
                    onClick={() => {
                        window.location.reload();
                    }}
                    style={{
                        borderRadius: "12px",
                        textAlign: "center",
                        background: "#B5341F",
                        color: "#fff",
                        fontSize: "16px",
                        lineHeight: "48px",
                        marginTop: "48px",
                        cursor: "pointer",
                    }}
                >
                    Okay, I disabled ad blocker
                </div>
            </Dialog>
        )
    );
};

export default CheckAdsBlocker;

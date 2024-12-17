import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";
import "./OpenAppDrawer.scss";
import { APP_SHORT_NAME } from "@/config_app";
import { ANDROID_STORE_PATH, IOS_STORE_PATH } from "@/config/config_web";
import { getUserAgent } from "@/utils/userAgent";
import dynamic from "next/dynamic";
import { IAppInfo } from "@/models/AppInfo";
import { useState } from "react";
import useThemeCustom from "../v4-material/useThemeCustom";
const Drawer = dynamic(() => import("@mui/material/Drawer"));

const LOGO_URL = "/info/images/" + APP_SHORT_NAME + "/logo60.png";

const OpenAppDrawer = ({ appInfo }: { appInfo: IAppInfo }) => {
    const { theme } = useThemeCustom();
    const isMobile = useMediaQuery("(max-width: 768px)"); // viết như này để nếu có build static thì đk này luôn sai => return null ở dưới
    let userAgent = getUserAgent();
    const [open, setOpen] = useState(true);
    if (!isMobile) {
        return null;
    } else
        return (
            <Drawer
                anchor="bottom"
                className="open-in-app-drawer"
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
            >
                <div className={`drawer-container ${theme}`}>
                    <Image src={LOGO_URL} className="logo" alt="logo" width={42} height={42} loading="lazy" />
                    <div className="main-text">Use the {APP_SHORT_NAME.toUpperCase()} app for the best experience.</div>
                    <div className="continue-btn">
                        <span
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            Continue using mobile site
                        </span>
                    </div>
                    <a
                        rel="noopener noreferrer"
                        target="_blank"
                        href={
                            "/" +
                            (appInfo?.appNameId ? appInfo?.appNameId + "/" : "") +
                            (userAgent === "IOS" ? IOS_STORE_PATH : ANDROID_STORE_PATH)
                        }
                        className="btn-open-in-app"
                    >
                        Open in App
                    </a>
                </div>
            </Drawer>
        );
};

export default OpenAppDrawer;

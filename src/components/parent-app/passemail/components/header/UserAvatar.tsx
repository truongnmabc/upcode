import Routes from "@/config/routes";
import { IAppInfo } from "@/models/AppInfo";
import AppState from "@/redux/appState";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./UserAvatar.scss";
import { useDialog } from "@/components/v4-material/DialogProvider";
import { findAppExistedData, logout, syncDataFromWebToServer } from "@/redux/reporsitory/syncData.repository";
import { genAppKey } from "@/utils/genKey";

const UserAvatar = ({ appInfo, pro }: { appInfo: IAppInfo; pro: boolean }) => {
    const router = useRouter();
    const userInfo = useSelector((state: AppState) => state.userReducer.userInfo);
    let url = Routes.LOGIN_PAGE + "?callback=" + router.asPath;
    if (appInfo.appNameId) {
        url += "&" + Routes.PARAM_APP_NAME_ID + "=" + appInfo.appNameId;
    }
    const avatarRef = useRef<HTMLImageElement>(null);

    return !!userInfo ? (
        <>
            <div className="user-avatar">
                <img src={userInfo.avatar} alt="user-avatar" width={38} height={38} ref={avatarRef} className="avatar" />
                {pro && <img src="/images/passemall/new-pro/pro-crown.png" className="pro-crown" />}
                <AvatarOption appInfo={appInfo} avatarRef={avatarRef} />
            </div>
        </>
    ) : (
        <a href={url} style={{ textDecoration: "none" }}>
            Log in
        </a>
    );
};

const AvatarOption = ({ appInfo, avatarRef }: { appInfo: IAppInfo; avatarRef: React.MutableRefObject<HTMLImageElement> }) => {
    const router = useRouter();
    const _className = "popover-container";
    const handleClose = () => {
        if (!!areaRef.current) {
            if (areaRef.current.className.includes("show")) areaRef.current.className = _className + " hide";
        }
    };
    const handleOpen = () => {
        if (!!areaRef.current) areaRef.current.className = _className + " show";
    };
    const { openDialog, closeDialog } = useDialog();
    const areaRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (e.target) {
                if (!areaRef.current?.contains(e.target as Node)) handleClose();
            }
        };
        window.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!!avatarRef.current) {
            const onHoverAvatar = (e: MouseEvent) => {
                handleOpen();
            };
            avatarRef.current.addEventListener("click", onHoverAvatar);
            avatarRef.current.addEventListener("mouseenter", onHoverAvatar);
            return () => {
                avatarRef.current?.removeEventListener("mouseenter", onHoverAvatar);
                avatarRef.current?.removeEventListener("click", onHoverAvatar);
            };
        }
    }, [avatarRef.current]);

    return (
        <div className={_className} ref={areaRef}>
            <div
                onClick={() => {
                    handleClose();
                    openDialog({
                        childen: (
                            <ConfirmLogout
                                onClose={closeDialog}
                                onConfirm={() => {
                                    dispatch(logout());
                                    closeDialog();
                                }}
                                appInfo={appInfo}
                            />
                        ),
                        className: "confirm-logout",
                    });
                }}
            >
                Log out
            </div>
            <div
                className={!router.asPath.includes("/billing") ? "" : "_disable"}
                onClick={() => {
                    if (!window.location.href.includes("/billing"))
                        window.location.href = "/billing" + (appInfo.appNameId ? "?appNameId=" + appInfo.appNameId : "");
                    // if (!router.asPath.includes("/billing"))
                    //     router.push("/billing" + (appInfo.appNameId ? "?appNameId=" + appInfo.appNameId : ""));
                }}
            >
                Billing History
            </div>
        </div>
    );
};

const ConfirmLogout = ({ onClose, onConfirm, appInfo }: { onClose: any; onConfirm: any; appInfo: IAppInfo }) => {
    const dispatch = useDispatch();
    const appKey = genAppKey(appInfo);
    const state = useSelector((state: AppState) => state);
    const [alert, setAlert] = useState("");
    useEffect(() => {
        dispatch(syncDataFromWebToServer({ appKey, logout: true })); // chỗ này chỉ sync dữ liệu của 1 app, trong thực tế có thể còn tồn tại dữ liệu của nhiều app trong queue, lúc này sẽ hiện thông báo
        let res = findAppExistedData(state, appKey);
        if (res.length > 0) {
            let cf = `You have not-synced-data from ${res.join(
                ", "
            )}, please access learning site of these app for automatic synchronization, or choose 'Confirm' for ignore and logout`;
            setAlert(cf);
        }
    }, []);

    return (
        <div className="popup-confirm-logout">
            <p>Do you want to log out of your account?</p>
            <p style={{ width: "360px" }}>{alert}</p>
            <div>
                <button className="cf_cancel" onClick={onClose}>
                    Cancel
                </button>
                <button className="cf_confirm" onClick={onConfirm}>
                    Confirm
                </button>
            </div>
        </div>
    );
};

export default UserAvatar;

export const parseBoolean = (b: unknown): boolean => {
    if (b === null || b === undefined) return false;
    return b === true || b === "true";
};

export const validateEmail = (email: string) => {
    if (email?.length == 0) {
        return false;
    }
    const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

// import { isParentApp } from "@/config/config_web";
import { IAppInfo } from "@/models/app/appInfo";

export function setScrollDownAuto(screen: unknown) {
    // Lưu trạng thái hiện tại của trang vào localStorage
    function savePagePosition() {
        localStorage.setItem("scrollPosition", window.pageYOffset.toString());
    }
    // Khôi phục trạng thái của trang từ localStorage
    function restorePagePosition() {
        const scrollPosition = localStorage.getItem("scrollPosition");
        if (scrollPosition) {
            window.scrollTo(0, parseInt(scrollPosition));
        }
    }
    if (typeof window !== "undefined") {
        if (screen === "home") {
            restorePagePosition();
            savePagePosition();
        } else {
        }
    }
}

export const getLink = (app: IAppInfo, stateSlug = "") => {
    let link = "";
    if (app.appNameId.startsWith("http")) {
        link = app.appNameId;
    } else {
        link = "/" + app.appNameId;
        if (stateSlug && app.hasState) {
            // if (isParentApp()) link += "/" + stateSlug;
            // else link = "/" + stateSlug;
        }
    }
    return link;
};

export function convertTime(time: number) {
    const hours = time / 3600;
    const minutes = (time - hours * 3600) / 60;
    const seconds = time - hours * 3600 - minutes * 60;
    return (
        (hours.toString().length == 2
            ? hours.toString()
            : "0" + hours.toString()) +
        " : " +
        (minutes.toString().length == 2
            ? minutes.toString()
            : "0" + minutes.toString()) +
        " : " +
        (seconds.toString().length == 2
            ? seconds.toString()
            : "0" + seconds.toString())
    );
}

export const getTitle = (appInfo: IAppInfo) => {
    return "Full-length " + appInfo.appName + " Practice Test";
};

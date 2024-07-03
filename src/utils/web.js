import { isWebPASSEMALL } from "@/config/config_web";
import Routes from "@/config/routes";

export function setCookieDate(key, value, d) {
    if (typeof window !== "undefined") {
        var expires = "expires=" + d.toUTCString();
        document.cookie = key + "=" + value + ";" + expires + ";path=/";
    }
}

export function getCookie(key) {
    if (typeof window !== "undefined") {
        var name = key + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    return "";
}

export function convertMillisecondsToDateZTime(milliseconds) {
    const date = new Date(milliseconds);
    const year = date.getUTCFullYear().toString().padStart(4, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}

export const getKeyTheme = (appInfo) => {
    return appInfo?.appNameId + "-local-theme";
};

export const urlNoUsingDarkMode = (pathname) => {
    return (
        (pathname?.length &&
            (pathname.includes(Routes.UPGRADE_PRO) ||
                pathname.includes(Routes.LOGIN_PAGE) ||
                pathname.includes(Routes.THANK_YOU) ||
                pathname.includes(Routes.ABOUT_US) ||
                pathname.includes(Routes.CONTACTS) ||
                pathname.includes(Routes.BILLING))) ||
        (pathname === "/" && isWebPASSEMALL())
    );
};

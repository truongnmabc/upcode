import { APP_SHORT_NAME, GA4_ID } from "../config_app";
// log specific events happening.
export const event = ({ action, params, appId = null }) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", action, {
            ...params,
            time: new Date(),
            app: appId ?? APP_SHORT_NAME,
        });
    }
};

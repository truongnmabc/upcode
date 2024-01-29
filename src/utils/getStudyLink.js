import { isParentApp } from "@/config/config_web";
import { getLink } from ".";

/**
 * vì app đặt appShortName rất là lung tung nên phải có hàm xử lý tạm này
 * @param {*} appshortName trường appShortName trogn appInfo
 */
const getAppShortName = (appshortName) => {
    if (!appshortName) return "";
    return appshortName.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
};

const genFullStudyLink = (appInfo, topicTag) => {
    // gen link cho app cha và app con
    let _isParentApp = isParentApp();
    let prefix = _isParentApp ? getLink(appInfo, "") : "";
    let url = genStudyLink(appInfo, topicTag);
    return prefix + url;
};
const genStudyLink = (appInfo, topicTag) => {
    let url = "";
    if (!!topicTag) url = `/${getAppShortName(appInfo.appShortName)}-${topicTag}-practice-test`; //trường hợp topic
    else url = `/full-length-${getAppShortName(appInfo.appShortName)}-practice-test`; // trường hợp full-length test
    // trường hợp branch
    return url;
};
export { getAppShortName, genFullStudyLink, genStudyLink };

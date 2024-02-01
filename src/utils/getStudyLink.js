import { isParentApp } from "@/config/config_web";
import { getLink } from ".";

const genFullStudyLink = (appInfo, topicTag) => {
    // gen link cho app cha và app con
    let _isParentApp = isParentApp();
    let prefix = _isParentApp ? getLink(appInfo, "") : "";
    let url = genStudyLink(appInfo.appShortName, topicTag);
    return prefix + url;
};
const genStudyLink = (appShortName, topicTag) => {
    let url = "";
    if (!!topicTag) {
        url = topicTag;
        if (!topicTag.includes(appShortName)) url = appShortName + "-" + url;
        if (!topicTag.includes("practice")) url = url + "-" + "practice-test";
        url = "/" + url;
        // url = `/${appShortName}-${topicTag}-practice-test`; //trường hợp topic
    } else url = `/full-length-${appShortName}-practice-test`; // trường hợp full-length test
    // trường hợp branch
    return url;
};
export { genFullStudyLink, genStudyLink };

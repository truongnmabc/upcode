import { isParentApp } from "@/config/config_web";
import { getLink } from ".";

const genFullStudyLink = (appInfo, tag, fullTest) => {
    // gen link cho app cha và app con
    let _isParentApp = isParentApp();
    let prefix = _isParentApp ? getLink(appInfo, "") : ""; // chú ý là link phần học sẽ không lấy state ở chỗ này, state sẽ nằm trong phần url bên dưới
    let url = genStudyLink(appInfo.appShortName, tag, fullTest);
    return prefix + url;
};
const genStudyLink = (appShortName, tag, fullTest) => {
    let url = "";
    if (!fullTest) {
        url = tag;
        if (!tag?.includes(appShortName)) url = appShortName + "-" + url;
        if (!tag?.includes("practice")) url = url + "-" + "practice-test";
        url = "/" + url;
        // url = `/${appShortName}-${tag}-practice-test`; //trường hợp topic
    } else {
        if (!!tag) url = `/full-length-${appShortName}-${tag}-practice-test`; // trường hợp full-length test
        else url = `/full-length-${appShortName}-practice-test`; // trường hợp full-length test
    }
    // trường hợp branch
    return url;
};
export { genFullStudyLink, genStudyLink };

import { isParentApp } from "@/config/config_web";
import { getLink } from ".";

const genFullStudyLink = (appInfo, tag, fullTest, _state = "") => {
    // gen link cho app cha và app con
    let _isParentApp = isParentApp();
    let prefix = _isParentApp ? getLink(appInfo, "") : ""; // chú ý là link phần học sẽ không lấy state ở chỗ này, state sẽ nằm trong phần url bên dưới
    let url = genStudyLink(appInfo.appShortName, tag, fullTest, _state);
    return prefix + url;
};
// có dấu / ở đầu
const genStudyLink = (appShortName, tag, fullTest, _state = "") => {
    // ****  NẾU SỬA HÀM NÀY THÌ PHẢI SỬA CẢ HÀM _genStudyLink TRONG FILE gen-data.js
    // trong đường dẫn có cả thành phần state
    let url = "";
    if (!fullTest) {
        url = tag;
        if (!tag?.includes(appShortName)) url = appShortName + "-" + url;
        if (!tag?.includes("practice")) url = url + "-" + "practice-test";
        if (_state) url = url.replace(appShortName, _state + "-" + appShortName);
        url = "/" + url;
    } else {
        if (!!tag) url = `/full-length-${_state ? _state + "-" + appShortName : appShortName}-${tag}-practice-test`;
        // trường hợp full-length test
        else url = `/full-length-${_state ? _state + "-" + appShortName : appShortName}-practice-test`; // trường hợp full-length test
    }
    // trường hợp branch
    return url;
};
export { genFullStudyLink, genStudyLink };

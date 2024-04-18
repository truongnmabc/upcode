import { isParentApp } from "@/config/config_web";
import listAppTopic from "../data/studyData.json";
import { genStudyLink } from "./getStudyLink";
const getRawTopicsData = (appInfo, _state) => {
    let listSubMenu = [];
    const appTopic = listAppTopic.find((topic) => topic.appId === appInfo.appId);
    if (appTopic) {
        let tempTopics = appTopic.topics.filter((topic) => !topic.isBranch);
        if (_state) {
            tempTopics = tempTopics.filter(
                (topic) => genStudyLink(appInfo.appShortName, topic.tag, false, _state) === "/" + topic.url
            ); // phải check nhu này vì vđề string
        }

        const isParent = isParentApp();
        listSubMenu = tempTopics.map((t, index) => {
            const name = t.title;
            return {
                icon: "",
                tag: t.tag,
                name: name,
                id: t.tag + index,
                topics: [],
                slug: isParent ? "/" + appInfo.appNameId + "/" + t.url : "/" + t.url,
            };
        });
    }
    return listSubMenu;
};

export const getAppTopics = () => listAppTopic;
export default getRawTopicsData;

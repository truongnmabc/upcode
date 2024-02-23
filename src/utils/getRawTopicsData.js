import { isParentApp } from "@/config/config_web";
import listAppTopic from "../data/studyData.json";
const getRawTopicsData = (appInfo, _state) => {
    let listSubMenu = [];
    const appTopic = listAppTopic.find((topic) => topic.appId === appInfo.appId);
    if (appTopic) {
        let tempTopics = appTopic.topics.filter((topic) => !topic.isBranch);
        if (_state) tempTopics = tempTopics.filter((topic) => topic.url.includes(_state));

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

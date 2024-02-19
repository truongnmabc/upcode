import listAppTopic from "../data/studyData.json";
const getRawTopicsData = (appId) => {
    let listSubMenu = [];
    const appTopic = listAppTopic.find((topic) => topic.appId === appId);
    if (appTopic) {
        const tempTopics = appTopic.topics.filter((topic) => !topic.isBranch);
        listSubMenu = tempTopics.map((t, index) => {
            const name = t.title;
            return {
                icon: "",
                tag: t.tag,
                name: name,
                id: t.tag + index,
                topics: [],
            };
        });
    }
    return listSubMenu;
};

export const getAppTopics = () => listAppTopic;
export default getRawTopicsData;

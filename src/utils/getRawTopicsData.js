import listAppTopic from "../data/topic-landing-page.json";
const getRawTopicsData = (appShortName) => {
    let listSubMenu = [];
    const appTopic = listAppTopic.find((topic) => topic.appName === appShortName);
    if (appTopic) {
        const tempTopics = appTopic.topics.filter((topic) => !topic.isBranch);
        listSubMenu = tempTopics.map((t, index) => {
            const name = t.learnUrl
                .split("-")
                .map((word) => (word[0] ? word[0].toUpperCase() : "" + word.slice(1)))
                .join(" ");
            return {
                icon: "",
                tag: t.learnUrl,
                name: name,
                id: t.learnUrl + index,
                topics: [],
            };
        });
    }
    return listSubMenu;
};
export default getRawTopicsData;

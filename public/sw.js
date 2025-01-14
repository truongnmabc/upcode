self.importScripts("./idb.js");

self.addEventListener("install", (event) => {
    console.log("Service Worker installed.", event);
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker activated.", event);
});

self.addEventListener("message", async (event) => {
    if (event.data.type === "INIT_DB") {
        const { appShortName, apiPath } = event.data.payload;

        await handleInitData(appShortName, apiPath);

        event.ports[0].postMessage({
            status: "success",
            message: "DB initialized and data fetched.",
        });
    }
});

async function initializeDBIdb(appShortName) {
    return await idb.openDB(appShortName, 10, {});
}

async function handleInitData(appShortName, apiPath) {
    const db = await initializeDBIdb(appShortName);
    try {
        const response = await fetch(
            `${apiPath.GET_DATA_STUDY}/${appShortName}`
        );
        const data = await response.json();
        const { topic, tests } = data.data;
        await initDataTopics(topic, db);
        const listTest = {
            ...tests,
            finalTests: tests.finalTests?.slice(0, 1),
        };

        console.log("🚀 ~ handleInitData ~ listTest:", listTest);

        await initDataTest(listTest, db, apiPath);
        await fetchAndProcessTopicsRecursive(topic, db, apiPath);
    } catch (error) {
        console.error("Failed to fetch and initialize data:", error);
    }
}

const fetchAndProcessTopicsRecursive = async (topics, db, apiPath) => {
    if (!topics || topics.length === 0) return;

    const [currentTopic, ...remainingTopics] = topics;
    const id = currentTopic.id;
    const icon = currentTopic.icon;
    const tag = currentTopic.tag;
    const topicStatusTx = db.transaction("topicStatus", "readwrite");
    const topicStatusStore = topicStatusTx.objectStore("topicStatus");

    const exists = await topicStatusStore.get(id);

    if (!exists) {
        try {
            await topicStatusStore.add({
                id,
            });
            await topicStatusStore.done;
            const response = await fetch(`${apiPath.GET_DATA_TOPICS}/${id}`);
            const result = await response.json();
            const { data } = result;
            processQuestionsData(data, db, icon, tag);
        } catch (err) {
            console.error("🚀 ~ fetchAndProcessTopicsRecursive ~ err:", err);
        }
    }

    await fetchAndProcessTopicsRecursive(remainingTopics, db, apiPath);
};

const processQuestionsData = async (topics, db, icon, tag) => {
    for (const topic of topics) {
        const subTopicTag = topic.tag;

        for (const part of topic?.topics) {
            if (part.contentType === 0) {
                const topicQuestionTx = db.transaction(
                    "topicQuestion",
                    "readwrite"
                );
                const topicQuestionStore =
                    topicQuestionTx.objectStore("topicQuestion");

                const questions = part?.questions.map((item) => ({
                    ...item,
                    parentId: part.id,
                    icon: icon,
                    tag: tag,
                }));

                await topicQuestionStore.add({
                    ...part,
                    questions: questions,
                    subTopicTag,
                    status: 0,
                });
                await topicQuestionStore.done;
            }
        }
        await calculatePassing(topic, db);
        await initDataSubTopicProgress(topic, db);
    }
};

const initDataSubTopicProgress = async (topic, db) => {
    const subTopicProgressTx = db.transaction("subTopicProgress", "readwrite");
    const subTopicProgressStore =
        subTopicProgressTx.objectStore("subTopicProgress");

    await subTopicProgressStore.add({
        id: topic?.id || 0,
        parentId: topic.parentId,
        part: topic?.topics
            ?.filter((item) => item.contentType === 0)
            .map((item) => ({
                id: item.id,
                parentId: item.parentId,
                status: 0,
                totalQuestion: item.totalQuestion,
                tag: item.tag,
                turn: 1,
            })),
        subTopicTag: topic?.tag || "",
        pass: false,
    });
    await subTopicProgressStore.done;
};

const calculatePassing = async (topic, db) => {
    const passingTx = db.transaction("passing", "readwrite");
    const passingStore = passingTx.objectStore("passing");
    const exists = await passingStore.get(topic.id);
    await passingStore.done;
    if (!exists) {
        let listSubTopic = [];
        let total = 0;
        for (const part of topic.topics) {
            const totalLevel = part.questions.reduce(
                (sum, question) =>
                    sum + (question.level === -1 ? 50 : question.level),
                0
            );
            total += totalLevel;

            const totalQuestions = part.questions.length;

            const averageLevelPart =
                totalQuestions > 0 ? totalLevel / totalQuestions : 0;
            if (part?.contentType === 0) {
                listSubTopic.push({
                    id: part.id,
                    parentId: part.parentId,
                    averageLevel: averageLevelPart,
                    totalQuestion: part.totalQuestion,
                    topics: [],
                    passing: 0,
                });
            }
        }
        const totalQuestion = listSubTopic.reduce(
            (acc, cur) => acc + cur.totalQuestion,
            0
        );

        const passingTx = db.transaction("passing", "readwrite");
        const passingStore = passingTx.objectStore("passing");
        await passingStore.add({
            parentId: topic.parentId,
            id: topic.id,
            averageLevel: total / topic.totalQuestion,
            totalQuestion: totalQuestion,
            topics: listSubTopic,
            passing: 0,
        });
        await passingStore.done;
    }
};

const addIfNotExistsIDB = async (storeName, id, data) => {
    const getRequest = await storeName.get(id);
    if (!getRequest) {
        await storeName.add(data);
        await storeName.done;
    }
};

const initDataTopics = async (topics, db) => {
    for (const topic of topics) {
        const topicTx = db.transaction("topics", "readwrite");
        const topicStore = topicTx.objectStore("topics");
        const topicData = {
            ...topic,
            id: Number(topic.id),
            topics: topic.topics?.map((item) => ({
                ...item,
                slug: `${item.tag}-practice-test`,
                topics: item.topics?.filter((item) => item.contentType === 0),
            })),
            slug: `${topic.tag}-practice-test`,
        };
        await addIfNotExistsIDB(topicStore, topicData.id, topicData);
    }
};

const initDataTest = async (tests, db, apiPath) => {
    const listKey = Object.keys(tests);
    for (const name of listKey) {
        if (name === "diagnosticTestFormat") {
            return;
        } else {
            const list = tests[name];
            for (const test of list) {
                const testQuestionsTx = db.transaction(
                    "testQuestions",
                    "readwrite"
                );
                const testQuestionsStore =
                    testQuestionsTx.objectStore("testQuestions");
                const exists = await testQuestionsStore.get(test.id);
                await testQuestionsTx.done;

                if (!exists) {
                    const response = await fetch(
                        `${apiPath.GET_QUESTION_BY_ID}/${test.id}`
                    );
                    const data = await response.json();
                    const listQuestion = data.data;

                    const testQuestionsTx = db.transaction(
                        "testQuestions",
                        "readwrite"
                    );
                    const testQuestionsStore =
                        testQuestionsTx.objectStore("testQuestions");
                    await testQuestionsStore.add({
                        id: test.id,
                        parentId: test.id,
                        question: listQuestion,
                        duration: test.duration,
                        isPaused: false,
                        startTime: new Date().getTime(),
                        remainTime: test.duration * 60,
                        type: name,
                        status: 0,
                        turn: 1,
                        topicIds: test.topicIds,
                        groupExamData: test.groupExamData,
                    });
                    await testQuestionsTx.done;
                }
            }
        }
    }
};

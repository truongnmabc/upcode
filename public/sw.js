// import axiosInstance from "@/common/config/axios";
// import { API_PATH } from "@/common/constants/api.constants";
// import Topic from "@/models/topics/topics";
// import { fetchQuestions } from "@/redux/repository/game/initData/initPracticeTest";
// self.importScripts("https://cdn.jsdelivr.net/npm/idb@8/build/umd.js");

self.importScripts("./idb.js");

async function initializeDBIdb(appShortName) {
    return await idb.openDB(appShortName, 10, {
       
    });
}

async function handleInitData(appShortName, apiPath) {
    const db = await initializeDBIdb(appShortName);

    try {
        const response = await fetch(
            `${apiPath.GET_DATA_STUDY}/${appShortName}`
        );
        const data = await response.json();
        const { topic, tests } = data.data;

        const topicTx = db.transaction("topics", "readwrite");
        const topicStore = topicTx.objectStore("topics");
        await initDataTopics(topic, topicStore);


        const testQuestionsTx = db.transaction("testQuestions","readwrite")
        const testQuestionsStore = testQuestionsTx.objectStore("testQuestions");

        await initDataTest(tests,testQuestionsStore,apiPath)




    } catch (error) {
        console.error("Failed to fetch and initialize data:", error);
    }
}









const initDataSubTopicProgress = async (topic, db) => {
    await db.subTopicProgress.add({
        id: topic?.id || 0,
        parentId: topic.parentId,
        part: topic?.topics?.map((item) => ({
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
};


const calculatePassing = async ({ topic, db }) => {
    const exists = await db.passing.get(topic.id);
    if (!exists) {
        let listSubTopic = [];

        for (const part of topic.topics) {
            const totalLevel = part.questions.reduce(
                (sum, question) =>
                    sum + (question.level === -1 ? 50 : question.level),
                0
            );
            const totalQuestions = part.questions.length;
            const averageLevelPart =
                totalQuestions > 0 ? totalLevel / totalQuestions : 0;

            listSubTopic.push({
                id: part.id,
                parentId: part.parentId,
                averageLevel: averageLevelPart,
                totalQuestion: part.totalQuestion,
                topics: [],
                passing: 0,
            });
        }

        const totalAverageLevel = listSubTopic.reduce(
            (sum, subTopic) => sum + subTopic.averageLevel,
            0
        );
        await db
            .transaction(
                "rw",
                db.passing,
                async () =>
                    await db.passing.add({
                        parentId: topic.parentId,
                        id: topic.id,
                        averageLevel: totalAverageLevel,
                        totalQuestion: topic.totalQuestion,
                        topics: listSubTopic,
                        passing: 0,
                    })
            )
            .catch((error) => {
                console.log("error 2", error);
            });
    }
};

const processQuestionsData = async (topics, db) => {
    for (const topic of topics) {
        const subTopicTag = topic.tag;
        for (const part of topic?.topics) {
            await db
                .transaction(
                    "rw",
                    db.topicQuestion,
                    async () =>
                        await db.topicQuestion.add({
                            ...part,
                            questions: part?.questions.map((item) => ({
                                ...item,
                                parentId: part.id,
                            })),
                            subTopicTag,
                            status: 0,
                        })
                )
                .catch((error) => {
                    console.log("error 2", error);
                });
        }
        await calculatePassing({
            topic,
            db,
        });
        await initDataSubTopicProgress(topic, db);
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
                // const exists = await db?.testQuestions
                //     .where("parentId")
                //     .equals(test.id)
                //     .first();
                // if (!exists) {
                    const response = await fetch(
                        `${apiPath.GET_QUESTION_BY_ID}/${test.id}`
                    );
                    const data = await response.json();
                    const listQuestion = data.data
                    console.log("🚀 ~ initDataTest ~ data:", data)

                    db.add({
                        parentId: test.id,
                                question: listQuestion,
                                duration: test.duration,
                                isPaused: false,
                                startTime: new Date().getTime(),
                                remainTime: test.duration * 60,
                                type: name,
                                status: 0,
                                turn: 0,
                                topicIds: test.topicIds,
                                groupExamData: test.groupExamData,        
                    })
                    // await db
                    //     .transaction("rw", db.testQuestions, async () =>
                    //         db?.testQuestions.add({
                    //             parentId: test.id,
                    //             question: listQuestion,
                    //             duration: test.duration,
                    //             isPaused: false,
                    //             startTime: new Date().getTime(),
                    //             remainTime: test.duration * 60,
                    //             type: name,
                    //             status: 0,
                    //             turn: 0,
                    //             topicIds: test.topicIds,
                    //             groupExamData: test.groupExamData,
                    //         })
                    //     )
                    //     .catch((error) => {
                    //         console.log("error", error);
                    //     });
                // }
            }
        }
    }
};

const fetchAndProcessTopicsRecursive = async (topics, db) => {
    if (!topics || topics.length === 0) return;

    const [currentTopic, ...remainingTopics] = topics;
    const id = currentTopic.id;

    const exists = await db.topicStatus.get(id);

    if (!exists) {
        try {
            await db.topicStatus.add({
                id,
            });

            const response = await axiosInstance.get(
                `${API_PATH.GET_DATA_TOPICS}/${id}`
            );
            if (response.data.status === 1) {
                const data = response.data.data;
                processQuestionsData(data, db);
            }
        } catch (err) {
            console.error("🚀 ~ fetchAndProcessTopicsRecursive ~ err:", err);
        }
    }

    await fetchAndProcessTopicsRecursive(remainingTopics, db);
};


// Done------------------



self.addEventListener("install", (event) => {
    console.log("Service Worker installed.");
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker activated.");
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


const addIfNotExistsIDB = async (storeName, id, data) => {
    const getRequest = await storeName.get(id);
    if (!getRequest) {
        storeName.add(data);
        // storeName.done()
    }  
};
const initDataTopics = async (topics, db) => {
    for (const topic of topics) {
        const topicData = {
            ...topic,
            id: Number(topic.id),
            topics: topic.topics?.map(item => ({
                ...item,
            slug : `${item.tag}-practice-test`,

            })),
            slug : `${topic.tag}-practice-test`,
        };
        await addIfNotExistsIDB(db, topicData.id, topicData);
    }
};

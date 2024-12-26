"use client";
import axiosInstance from "@/common/config/axios";
import { API_PATH } from "@/common/constants/api.constants";
import { DB, initializeDB } from "@/db/db.model";
import { IAppInfo } from "@/models/app/appInfo";
import { IQuestion } from "@/models/question/questions";
import { ITest } from "@/models/tests/tests";
import Topic from "@/models/topics/topics";
import { fetchQuestions } from "@/redux/repository/game/initData/initPracticeTest";
import { Table } from "dexie";
import { useCallback, useLayoutEffect } from "react";

interface ITopic {
    id: number;
    parentId: number;
    name: string;
    icon: string;
    tag: string;
    type: number;
    contentType: number;
    orderIndex: number;
    topics: ITopic[];
    questions: IQuestion[];
    subTopicTag?: string;
    totalQuestion: number;
}

interface IResDataTest {
    finalTests: ITest[];
    practiceTests: ITest[];
    diagnosticTestFormat: ITest;
}

const InitData = ({ appInfo }: { appInfo: IAppInfo }) => {
    const addIfNotExists = useCallback(
        async <T extends { id: number }>(
            table: Table<T>,
            id: number,
            data: T
        ) => {
            const exists = await table.get(id);
            if (!exists) {
                await table.add(data);
            }
        },
        []
    );
    const initDataSubTopicProgress = useCallback(
        async (topic: ITopic, db: DB) => {
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
        },
        []
    );
    const processTreeData = useCallback(
        async (topics: ITopic[], db: DB) => {
            for (const topic of topics) {
                const topicData = new Topic({
                    ...topic,
                    id: Number(topic.id),
                    topics: topic.topics?.map(
                        (item) =>
                            new Topic({
                                ...item,
                            })
                    ),
                });
                await addIfNotExists(db.topics, topicData.id, topicData);
            }
        },
        [addIfNotExists]
    );

    const processQuestionsData = useCallback(
        async (topics: ITopic[], db: DB) => {
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
                                    questions: part?.questions.map(
                                        (item: IQuestion) => ({
                                            ...item,
                                            parentId: part.id,
                                        })
                                    ),
                                    subTopicTag,
                                    status: 0,
                                })
                        )
                        .catch((error) => {
                            console.log("error 2", error);
                        });
                }
                await initDataSubTopicProgress(topic, db);
            }
        },
        [initDataSubTopicProgress]
    );

    // *NOTE: init data

    const initDataTest = useCallback(async (tests: IResDataTest, db: DB) => {
        const listKey = Object.keys(tests) as (keyof IResDataTest)[];
        for (const name of listKey) {
            if (name === "diagnosticTestFormat") {
                return;
            } else {
                const list = tests[name];
                for (const test of list) {
                    const exists = await db?.testQuestions
                        .where("parentId")
                        .equals(test.id)
                        .first();
                    if (!exists) {
                        const listQuestion = await fetchQuestions(test.id);
                        await db
                            .transaction("rw", db.testQuestions, async () =>
                                db?.testQuestions.add({
                                    parentId: test.id,
                                    question: listQuestion,
                                    duration: test.duration,
                                    isPaused: false,
                                    startTime: new Date().getTime(),
                                    remainTime: test.duration * 60,
                                    type: name,
                                    status: 0,
                                    turn: 0,
                                })
                            )
                            .catch((error) => {
                                console.log("error", error);
                            });
                    }
                }
            }
        }
    }, []);

    const fetchAndProcessTopicsRecursive = useCallback(
        async (topics: ITopic[], db: DB) => {
            if (!topics || topics.length === 0) return;

            const [currentTopic, ...remainingTopics] = topics;
            const id = currentTopic.id;

            // NOTE : Kiểm tra xem topci đó đã có data chưa.
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
                    console.error(
                        "🚀 ~ fetchAndProcessTopicsRecursive ~ err:",
                        err
                    );
                }
            }

            await fetchAndProcessTopicsRecursive(remainingTopics, db);
        },
        [processQuestionsData]
    );

    const handleInitData = useCallback(
        async (db: DB) => {
            console.log(
                "Start time init indexedDb data:",
                new Date().toISOString()
            );

            const response = await axiosInstance.get(
                `${API_PATH.GET_DATA_STUDY}/${appInfo.appShortName}`
            );
            if (response.data.data) {
                const {
                    topic,
                    tests,
                }: {
                    topic: ITopic[];
                    tests: IResDataTest;
                } = response?.data?.data;

                //*NOTE  Khởi tạo danh sách topic

                await db
                    .transaction(
                        "rw",
                        db.topics,
                        db.subTopicProgress,
                        async () => await processTreeData(topic, db)
                    )
                    .catch((error) => {
                        console.log("error", error);
                    });

                // *NOTE Khởi tạo danh sách bài test

                await initDataTest(tests, db);

                await fetchAndProcessTopicsRecursive(topic, db);

                console.log(
                    "End time init indexedDb data:",
                    new Date().toISOString()
                );
            }
        },
        [
            appInfo.appShortName,
            processTreeData,
            fetchAndProcessTopicsRecursive,
            initDataTest,
        ]
    );

    useLayoutEffect(() => {
        if (appInfo) {
            const db = initializeDB(appInfo.appShortName);
            handleInitData(db);
        }
    }, [appInfo, handleInitData]);

    return <></>;
};

export default InitData;

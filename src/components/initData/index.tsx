"use client";
import axiosInstance from "@/common/config/axios";
import { API_PATH } from "@/common/constants/api.constants";
import { db } from "@/db/db.model";
import { IAppInfo } from "@/models/app/appInfo";
import { IQuestion } from "@/models/question/questions";
import { ITest } from "@/models/tests/tests";
import Topic from "@/models/topics/topics";
import { Table } from "dexie";
import { useCallback, useEffect } from "react";

export interface ITopic {
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

    const processTreeData = useCallback(
        async (topics: ITopic[]) => {
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

    const processQuestionsData = useCallback(async (topics: ITopic[]) => {
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
            await initDataSubTopicProgress(topic);
        }
    }, []);

    // *NOTE: init data

    const initDataSubTopicProgress = async (topic: ITopic) => {
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

    const initDataTest = async (tests: IResDataTest) => {
        const listKey = Object.keys(tests) as (keyof IResDataTest)[];
        for (const name of listKey) {
            if (name === "diagnosticTestFormat") {
                const exists = await db.tests.get(tests[name].id);
                if (!exists) {
                    await db.tests.add({
                        ...tests[name],
                        status: 0,
                        testType: name,
                    });
                }
            } else {
                const list = tests[name];
                for (const test of list) {
                    const exists = await db.tests.get(test.id);
                    if (!exists) {
                        await db.tests.add({
                            ...test,
                            status: 0,
                            testType: name,
                        });
                    }
                }
            }
        }
    };

    const fetchAndProcessTopicsRecursive = useCallback(
        async (topics: ITopic[]) => {
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
                        processQuestionsData(data);
                    }
                } catch (err) {
                    console.error(
                        "🚀 ~ fetchAndProcessTopicsRecursive ~ err:",
                        err
                    );
                }
            }

            await fetchAndProcessTopicsRecursive(remainingTopics);
        },
        [processQuestionsData]
    );

    const handleInitData = useCallback(async () => {
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
                    async () => await processTreeData(topic)
                )
                .catch((error) => {
                    console.log("error", error);
                });

            // *NOTE Khởi tạo danh sách bài test
            await db
                .transaction(
                    "rw",
                    db.tests,
                    async () => await initDataTest(tests)
                )
                .catch((error) => {
                    console.log("error", error);
                });

            await fetchAndProcessTopicsRecursive(topic);

            console.log(
                "End time init indexedDb data:",
                new Date().toISOString()
            );
        }
    }, [appInfo.appShortName, processTreeData, fetchAndProcessTopicsRecursive]);

    useEffect(() => {
        if (appInfo) handleInitData();
    }, [appInfo, handleInitData]);

    return <></>;
};

export default InitData;

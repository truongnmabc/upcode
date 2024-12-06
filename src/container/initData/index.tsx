"use client";
import axiosInstance from "@/common/config/axios";
import { API_PATH } from "@/common/constants/api.constants";
import { db } from "@/lib/db/db.model";
import { IAppInfo } from "@/lib/models/appInfo";
import SubTopicProgress from "@/lib/models/progress/subTopicProgress";
import { IQuestion } from "@/lib/models/question/questions";
import Part, { IPart } from "@/lib/models/topics/part";
import Topic from "@/lib/models/topics/topics";
import { Table } from "dexie";
import { useEffect } from "react";

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
}

const InitData = ({ appInfo }: { appInfo: IAppInfo }) => {
  const addIfNotExists = async <T extends { id: number }>(
    table: Table<T>,
    id: number,
    data: T
  ) => {
    const exists = await table.get(id);
    if (!exists) {
      await table.add(data);
    }
  };

  const processTreeData = async (
    topics: ITopic[],
    table: Table<Topic | IPart> | "subtopic"
  ) => {
    for (const topic of topics) {
      if (table === db.topics) {
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

        if (topic.topics && topic.topics.length > 0) {
          await processTreeData(topic.topics, "subtopic");
        }
      } else if (table === "subtopic") {
        if (topic.topics && topic.topics.length > 0) {
          await processTreeData(topic.topics, db.part);
        }
      } else if (table === db.part) {
        const partData = new Part({
          ...topic,
          id: Number(topic.id),
        });

        await addIfNotExists(db.part, partData.id, partData);
      }
    }
  };

  const processQuestionsData = async (topics: ITopic[]) => {
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
                questions: part?.questions.map((item: IQuestion) => ({
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
      await initDataSubTopicProgress(topic);
    }
  };

  // *NOTE: init data

  const initDataSubTopicProgress = async (topic: ITopic) => {
    const newPart = new Part(topic?.topics?.[0]);
    await db.subTopicProgress.add(
      new SubTopicProgress({
        id: topic?.id || 0,
        parentId: topic.parentId,
        part: [
          {
            ...newPart,
            status: 0,
          },
        ],
        subTopicTag: topic?.tag || "",
      })
    );
  };

  const fetchAndProcessTopicsRecursive = async (topics: ITopic[]) => {
    if (!topics || topics.length === 0) return;

    const [currentTopic, ...remainingTopics] = topics;
    const id = currentTopic.id;

    const exists = await db.topicStatus.get(id);

    if (!exists) {
      try {
        await db.topicStatus.add({
          id,
          parentId: id,
        });

        const response = await axiosInstance.get(
          `${API_PATH.GET_DATA_TOPICS}/${id}`
        );
        if (response.data.status === 1) {
          const data = response.data.data;
          processQuestionsData(data);
        }
      } catch (err) {
        console.error("🚀 ~ fetchAndProcessTopicsRecursive ~ err:", err);
      }
    }

    await fetchAndProcessTopicsRecursive(remainingTopics);
  };

  const handleInitData = async () => {
    console.log("Start time init indexedDb data:", new Date().toISOString());

    const response = await axiosInstance.get(
      `${API_PATH.GET_DATA_STUDY}/${appInfo.appShortName}`
    );
    if (response.data.data) {
      const {
        topic,
      }: {
        topic: ITopic[];
      } = response?.data?.data;

      await db
        .transaction(
          "rw",
          db.topics,
          db.part,
          async () => await processTreeData(topic, db.topics)
        )
        .catch((error) => {
          console.log("error", error);
        });

      await fetchAndProcessTopicsRecursive(topic);

      console.log("End time init indexedDb data:", new Date().toISOString());
    }
  };

  useEffect(() => {
    if (appInfo) handleInitData();
  }, [appInfo]);

  return <></>;
};

export default InitData;

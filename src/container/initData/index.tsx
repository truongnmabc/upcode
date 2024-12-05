"use client";
import axiosInstance from "@/common/config/axios";
import { db } from "@/lib/db/db.model";
import { IAppInfo } from "@/lib/models/appInfo";
import React, { useEffect } from "react";
import Topic, { ITopic } from "@/lib/models/topics/topics";
import { API_PATH } from "@/common/constants/api.constants";
import Part from "@/lib/models/topics/part";
import { IQuestion } from "@/lib/models/question/questions";
import SubTopicProgress from "@/lib/models/progress/subTopicProgress";
import { ITopicQuestion } from "@/lib/models/question/topicQuestion";

const InitData = ({ appInfo }: { appInfo: IAppInfo }) => {
  const addIfNotExists = async (table: any, id: number, data: any) => {
    const exists = await table.get(id);
    if (!exists) {
      await table.add(data);
    }
  };

  const processTreeData = async (topics: ITopic[], table: any) => {
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

  const processQuestionsData = async (topics: any[]) => {
    for (const topic of topics) {
      const subTopicTag = topic.tag;
      for (const part of topic.topics) {
        await db
          .transaction(
            "rw",
            db.topicQuestion,
            async () =>
              await db.topicQuestion.add({
                ...part,
                questions: part.questions.map((item: IQuestion) => ({
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

  const initDataSubTopicProgress = async (topic: ITopicQuestion) => {
    const newPart = new Part(topic.topics?.[0]);
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

"use client";

import { RANDOM_COLORS } from "@/common/constants";
import AllowExpand from "@/container/home/gridTopic/allowExpand";
import AllowExpandProvider from "@/container/home/gridTopic/allowExpand/provider";
import TitleTopic from "@/container/home/gridTopic/item/titleTopic";
import { db } from "@/lib/db/db.model";
import Topic, { ITopic } from "@/lib/models/topics/topics";
import { appInfoState } from "@/lib/redux/features/appInfo";
import { studyState } from "@/lib/redux/features/study";
import { useAppSelector } from "@/lib/redux/hooks";

import React, { Fragment, useEffect, useState } from "react";
export const generateMockTopics = (size: number): ITopic[] => {
  return Array.from({ length: size }, (_, index) => {
    const initData = new Topic({
      id: index,
    });
    return {
      ...initData,
      color: RANDOM_COLORS[index],
    };
  });
};
const mockData: ITopic[] = generateMockTopics(10);

const FN = () => {
  const { appInfo } = useAppSelector(appInfoState);
  const { selectedTopics } = useAppSelector(studyState);
  const [listMainTopics, setListMainTopics] = useState<ITopic[]>(mockData);
  const handleGetData = async () => {
    const listData = await db.topics.toArray();
    setListMainTopics(
      listData
        .map((item, index) => ({
          ...item,
          id: Number(item.id),
          color: RANDOM_COLORS[index],
        }))
        .sort((a, b) => {
          if (a.id === selectedTopics) return -1;
          if (b.id === selectedTopics) return 1;
          return 0;
        })
    );
  };

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="font-semibold text-xl font-poppins">{`More ${appInfo.appName} Topics`}</h3>
      <div className="w-full flex flex-col gap-2">
        {listMainTopics?.map((subTopic, index) => (
          <Fragment key={index}>
            <TitleTopic topic={subTopic} priority={3} />
            {selectedTopics === subTopic.id && (
              <AllowExpandProvider topic={subTopic}>
                <AllowExpand />
              </AllowExpandProvider>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

const GridTopicLeft = React.memo(FN);

export default GridTopicLeft;

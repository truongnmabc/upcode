"use client";
import { RANDOM_COLORS } from "@/common/constants";
import { ITopicEndTest } from "..";
import ItemListTopicResult from "./listTopicResult/item";
import React from "react";

const ChartContentResultPage = ({
    listTopic,
}: {
    listTopic: ITopicEndTest[];
}) => {
    return (
        <div className="w-full flex gap-10 justify-between  mt-9">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                {listTopic.map((item, index) => (
                    <ItemListTopicResult
                        item={{
                            ...item,
                            color: RANDOM_COLORS[index % RANDOM_COLORS.length],
                        }}
                        key={item.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default React.memo(ChartContentResultPage);

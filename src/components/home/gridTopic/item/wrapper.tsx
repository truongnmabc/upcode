"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { db } from "@/db/db.model";
import { ITopicProgress } from "@/models/topics/topicsProgress";
import AllowExpandProvider from "@/components/allowExpand/provider";
const AllowExpand = dynamic(() => import("@/components/allowExpand"), {
    ssr: false,
});

const Wrapper = ({ topicsId }: { topicsId: number }) => {
    const [topic, setTopic] = useState<ITopicProgress | null>(null);

    const handleGetData = useCallback(async () => {
        if (topicsId) {
            const topics = await db?.topics.get(topicsId);
            if (topics) setTopic(topics);
        }
    }, [topicsId]);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);

    return (
        <AllowExpandProvider topic={topic}>
            <AllowExpand />
        </AllowExpandProvider>
    );
};

export default Wrapper;

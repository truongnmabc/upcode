import AllowExpand from "@/components/home/gridTopic/allowExpand";
import AllowExpandProvider from "@/components/home/gridTopic/allowExpand/provider";
import { ITopic } from "@/components/initData";
import { db } from "@/db/db.model";
import { selectTopics } from "@/redux/features/study";
import { useAppDispatch } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const GridTopicProgress = () => {
    const [listSubTopics, setListSubTopics] = useState<ITopic | null>();
    const slug = useSearchParams().get("topic");
    const dispatch = useAppDispatch();
    const handleGetData = useCallback(async () => {
        if (slug) {
            const data = await db.topics.where("slug").equals(slug).first();
            if (data) {
                dispatch(selectTopics(data.id));
                setListSubTopics(data as ITopic);
            }
        }
    }, [slug, dispatch]);

    useEffect(() => {
        handleGetData();
    }, [slug, handleGetData]);
    return (
        <div className="px-2">
            {listSubTopics && (
                <div className="w-full h-full rounded-md p-4 bg-white">
                    <AllowExpandProvider topic={listSubTopics}>
                        <AllowExpand />
                    </AllowExpandProvider>
                </div>
            )}
        </div>
    );
};

export default GridTopicProgress;

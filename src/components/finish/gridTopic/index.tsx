import AllowExpand from "@/components/allowExpand";
import AllowExpandProvider from "@/components/allowExpand/provider";
import { db } from "@/db/db.model";
import { ITopic } from "@/models/topics/topics";
import { selectTopics } from "@/redux/features/study";
import { useAppDispatch } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";
import { Fragment, useCallback, useEffect, useState } from "react";

const GridTopicProgress = () => {
    const [listSubTopics, setListSubTopics] = useState<ITopic | null>();
    const slug = useSearchParams().get("topic");
    const dispatch = useAppDispatch();

    const handleGetData = useCallback(async () => {
        if (slug) {
            const data = await db?.topics.where("slug").equals(slug).first();
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
        <Fragment>
            {listSubTopics && (
                <div className="w-full h-full rounded-md  bg-white">
                    <AllowExpandProvider topic={listSubTopics}>
                        <AllowExpand />
                    </AllowExpandProvider>
                </div>
            )}
        </Fragment>
    );
};

export default GridTopicProgress;

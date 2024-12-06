"use client";
import { MtUiButton } from "@/components/button";
import { db } from "@/lib/db/db.model";
import { selectSubTopics, setOptQuery } from "@/lib/redux/features/study";
import { useAppDispatch } from "@/lib/redux/hooks";
import initQuestionThunk from "@/lib/redux/repository/game/initQuestion";
import { useRouter, useSearchParams } from "next/navigation";

const FinishPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const subTopicProgressId = useSearchParams().get("subTopicProgressId");
    const fetchSubTopicData = async () => {
        if (subTopicProgressId) {
            console.log(
                "🚀 ~ fetchSubTopicData ~ subTopicProgressId:",
                subTopicProgressId
            );
            const progress = await db.subTopicProgress
                .where("id")
                .equals(Number(subTopicProgressId))
                .toArray();

            const incompleteProgress = progress.find(
                (item) => !item.pass && item.part?.some((p) => p.status === 0)
            );

            const nextPart = incompleteProgress?.part?.find(
                (p) => p.status === 0
            );

            if (incompleteProgress)
                dispatch(selectSubTopics(incompleteProgress?.id));

            dispatch(
                initQuestionThunk({
                    partTag: nextPart?.tag || "",
                    subTopicTag: incompleteProgress?.subTopicTag || "",
                })
            );

            dispatch(
                setOptQuery({
                    partTag: nextPart?.tag || "",
                    subTopicTag: incompleteProgress?.subTopicTag || "",
                })
            );

            router.back();
        }
    };

    return (
        <div className="w-full h-full gap-3 flex-col flex items-center justify-center">
            <p>FinishPage</p>
            <div className="flex gap-2 items-center">
                <MtUiButton>Try Again</MtUiButton>
                <MtUiButton onClick={fetchSubTopicData} type="primary">
                    Next Part
                </MtUiButton>
            </div>
        </div>
    );
};

export default FinishPage;

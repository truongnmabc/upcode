import { selectCurrentTopicId } from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initLearnQuestionThunk from "@/redux/repository/game/initData/initLearningQuestion";
import initPracticeThunk from "@/redux/repository/game/initData/initPracticeTest";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const LoadDataStudy = () => {
    const dispatch = useAppDispatch();
    const id = useAppSelector(selectCurrentTopicId);
    const type = useSearchParams()?.get("type");
    const tag = useSearchParams()?.get("tag");
    const testId = useSearchParams()?.get("testId");
    const subTopic = useSearchParams()?.get("subTopic");
    useEffect(() => {
        if ((!id || id === -1) && subTopic && tag && type === "learn") {
            dispatch(
                initLearnQuestionThunk({
                    partTag: tag,
                    subTopicTag: subTopic,
                })
            );
        }

        if ((!id || id === -1) && type === "test" && testId) {
            dispatch(initPracticeThunk({ testId: Number(testId) }));
        }
    }, [id, dispatch, type, tag, subTopic, testId]);
    return null;
};

export default LoadDataStudy;

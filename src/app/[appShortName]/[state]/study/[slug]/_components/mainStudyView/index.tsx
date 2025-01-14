"use client";
import ClockIcon from "@/components/icon/ClockIcon";
import { MathJaxContext } from "better-react-mathjax";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import CountTimeRemainPracticeTest from "./countTimeTest";
import ProgressQuestion from "@/components/progressQuestion";
import QuestionContent from "@/components/question";
import ExplanationDetail from "@/components/explanation";
import ChoicesPanel from "@/components/choicesPanel";
import BottomActions from "@/components/bottomActions";
import TitleQuestion from "@/components/titleQuestion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectIdTopic } from "@/redux/features/game.reselect";
import initLearnQuestionThunk from "@/redux/repository/game/initData/initLearningQuestion";
import initPracticeThunk from "@/redux/repository/game/initData/initPracticeTest";

const MainStudyView = () => {
    const type = useSearchParams().get("type");

    return (
        <MathJaxContext>
            <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                <div className="sm:p-4 flex flex-col gap-3">
                    {type && <TitleQuestion />}
                    <ProgressQuestion />
                    {type === "test" && (
                        <div className="w-full flex items-center justify-center">
                            <div className="flex items-center justify-center w-fit gap-2">
                                <ClockIcon />
                                <CountTimeRemainPracticeTest />
                            </div>
                        </div>
                    )}
                    <QuestionContent />
                    <ChoicesPanel />
                    <ExplanationDetail />
                </div>

                <BottomActions type="learn" />
            </div>
            <LoadData />
        </MathJaxContext>
    );
};
export default React.memo(MainStudyView);

const LoadData = () => {
    const dispatch = useAppDispatch();
    const id = useAppSelector(selectIdTopic);
    const type = useSearchParams().get("type");
    const tag = useSearchParams().get("tag");
    const testId = useSearchParams().get("testId");
    const subTopic = useSearchParams().get("subTopic");
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

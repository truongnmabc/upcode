"use client";
import BottomActions from "@/components/bottomActions";
import ChoicesPanel from "@/components/choicesPanel";
import ExplanationDetail from "@/components/explanation";
import QuestionContent from "@/components/question";
import { MathJaxContext } from "better-react-mathjax";
import React, { useEffect } from "react";
import EmotionComponent from "../emotion/emotionComponent";
import TimeTestGetLever from "../timeTest";
import ProgressQuestion from "@/components/progressQuestion";
import TitleQuestion from "@/components/titleQuestion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCurrentTopicId } from "@/redux/features/game.reselect";
import initDiagnosticTestQuestionThunk from "@/redux/repository/game/initData/initDiagnosticTest";
import { useIsMobile } from "@/hooks/useIsMobile";
import CountTimeDiagnostic from "../countTimeRemain";
import ClockIcon from "@/components/icon/ClockIcon";

const ContentTestView = () => {
    const isMobile = useIsMobile();

    return (
        <MathJaxContext>
            <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                <div className="sm:p-4  flex flex-col gap-3">
                    <TitleQuestion />
                    <ProgressQuestion />
                    {isMobile && (
                        <div className="flex items-center justify-center w-full gap-2">
                            <ClockIcon />
                            <CountTimeDiagnostic />
                        </div>
                    )}
                    <div
                        className="bg-white flex flex-col rounded-lg p-3"
                        style={{
                            boxShadow: isMobile
                                ? "0px 4px 20px 0px #2121211A"
                                : "none",
                        }}
                    >
                        <TimeTestGetLever />

                        <QuestionContent
                            showStatus={false}
                            showShadow={false}
                        />
                        <EmotionComponent />
                    </div>
                    <ChoicesPanel />
                    <ExplanationDetail unLock={true} />
                </div>

                <BottomActions isShow={true} type="diagnostic" />
            </div>
            <LoadData />
        </MathJaxContext>
    );
};

export default ContentTestView;

const LoadData = () => {
    const idTopics = useAppSelector(selectCurrentTopicId);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!idTopics || idTopics === -1) {
            dispatch(initDiagnosticTestQuestionThunk());
        }
    }, [idTopics, dispatch]);

    return null;
};

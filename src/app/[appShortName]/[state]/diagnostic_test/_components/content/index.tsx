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
import { selectIdTopic } from "@/redux/features/game.reselect";
import initDiagnosticTestQuestionThunk from "@/redux/repository/game/initData/initDiagnosticTest";

const ContentTestView = () => {
    return (
        <MathJaxContext>
            <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                <div className="sm:p-4  flex flex-col gap-3">
                    <TitleQuestion />
                    <ProgressQuestion />
                    <TimeTestGetLever />
                    <QuestionContent showStatus={false} />
                    <EmotionComponent />
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
    const idTopics = useAppSelector(selectIdTopic);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!idTopics || idTopics === -1) {
            dispatch(initDiagnosticTestQuestionThunk());
        }
    }, [idTopics, dispatch]);

    return null;
};

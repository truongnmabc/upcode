"use client";
import { useAppDispatch } from "@/redux/hooks";
import initQuestionThunk from "@/redux/repository/game/initQuestion";
import initTestQuestionThunk from "@/redux/repository/game/initTestQuestion";
import beforeUnLoadThunk, {
    reloadStateThunk,
} from "@/redux/repository/utils/reload";
import { MathJaxContext } from "better-react-mathjax";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useLayoutEffect } from "react";
import BottomBtn from "./bottomBtn/bottomBtn";
import ChoicesPanel from "./choicesPanel/choicesPanel";
import ExplanationDetail from "./explanation/explanationDetail";
import ProgressQuestion from "./progress/progressQuestion";
import QuestionContent from "./question/questionContent";
import TitleQuestion from "./title/titleQuestion";
const FN = () => {
    const dispatch = useAppDispatch();
    const subTopicTag = useSearchParams().get("subTopic");
    const partTag = useSearchParams().get("tag");
    const type = useSearchParams().get("type");
    const handlePageReload = useCallback(() => {
        const data = localStorage.getItem("optQuery");
        if (data) {
            if (partTag && subTopicTag && type === "learn") {
                dispatch(
                    initQuestionThunk({
                        partTag: partTag,
                        subTopicTag: subTopicTag,
                    })
                );
            }

            if (type === "test") {
                dispatch(initTestQuestionThunk({}));
            }
            dispatch(reloadStateThunk());
            setTimeout(() => localStorage.removeItem("optQuery"), 100);
        }
    }, [dispatch, subTopicTag, partTag, type]);

    useLayoutEffect(() => {
        handlePageReload();
    }, [handlePageReload, subTopicTag, partTag, type]);

    const handleBeforeUnload = useCallback(
        () => dispatch(beforeUnLoadThunk()),
        [dispatch]
    );

    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [handleBeforeUnload]);
    return (
        <MathJaxContext>
            <div className=" sm:shadow-custom bg-transparent sm:bg-white  rounded-2xl dark:bg-black">
                <div className="sm:p-4 flex flex-col gap-3">
                    <TitleQuestion />
                    <ProgressQuestion />
                    <QuestionContent />
                    <ChoicesPanel />
                    <ExplanationDetail />
                </div>
                <BottomBtn />
            </div>
        </MathJaxContext>
    );
};
const MainStudyView = React.memo(FN);
export default MainStudyView;

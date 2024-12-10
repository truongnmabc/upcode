"use client";
import React, { useCallback, useEffect, useLayoutEffect } from "react";
import BottomBtn from "./bottomBtn/bottomBtn";
import ChoicesPanel from "./choicesPanel/choicesPanel";
import ExplanationDetail from "./explanation/explanationDetail";
import ProgressQuestion from "./progress/progressQuestion";
import QuestionContent from "./question/questionContent";
import TitleQuestion from "./title/titleQuestion";
import { IQueryOpt, setOptQuery } from "@/lib/redux/features/study";
import { useAppDispatch } from "@/lib/redux/hooks";
import initQuestionThunk from "@/lib/redux/repository/game/initQuestion";
import beforeUnLoadThunk from "@/lib/redux/repository/utils/reload";
import { MathJaxContext } from "better-react-mathjax";
const FN = () => {
  const dispatch = useAppDispatch();

  const handlePageReload = useCallback(() => {
    const data = localStorage.getItem("optQuery");
    if (data) {
      const optQuery: IQueryOpt = JSON.parse(data);
      if (optQuery.partTag && optQuery.subTopicTag) {
        dispatch(
          initQuestionThunk({
            partTag: optQuery.partTag,
            subTopicTag: optQuery.subTopicTag,
          })
        );
        dispatch(
          setOptQuery({
            partTag: optQuery.partTag,
            subTopicTag: optQuery.subTopicTag,
          })
        );
      }
      localStorage.removeItem("optQuery");
    }
  }, [dispatch]);

  useLayoutEffect(() => {
    handlePageReload();
  }, [handlePageReload]);

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

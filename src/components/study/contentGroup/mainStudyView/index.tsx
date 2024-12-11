"use client";
import { gameState } from "@/redux/features/game";
import { IQueryOpt, setOptQuery } from "@/redux/features/study";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initQuestionThunk from "@/redux/repository/game/initQuestion";
import initTestQuestionThunk from "@/redux/repository/game/initTestQuestion";
import beforeUnLoadThunk from "@/redux/repository/utils/reload";
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
  const testId = useSearchParams().get("testId");
  const { isFetched } = useAppSelector(gameState);
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

  const handleGetData = useCallback(async () => {
    if (type === "test") {
      console.log("test");
      dispatch(
        initTestQuestionThunk({
          testId,
        })
      );
      return;
    }
    if (subTopicTag && partTag) {
      dispatch(
        initQuestionThunk({
          partTag: partTag,
          subTopicTag: subTopicTag,
        })
      );
    }
  }, [subTopicTag, partTag, type, testId]);

  useLayoutEffect(() => {
    if (isFetched) return;
    // handleGetData();
  }, [subTopicTag, partTag, type, testId, isFetched]);

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

"use client";

import { Grid2 } from "@mui/material";
import { MathJaxContext } from "better-react-mathjax";
import React, { useEffect, useLayoutEffect } from "react";
import ContentGroup from "./contentGroup";
import HeaderMobile from "./headerMobile";
import QuestionGroup from "./questionGroup";
import { useAppDispatch } from "@/lib/redux/hooks";
import beforeUnLoadThunk from "@/lib/redux/repository/utils/reload";
import initQuestionThunk from "@/lib/redux/repository/game/initQuestion";
import { IQueryOpt, setOptQuery } from "@/lib/redux/features/study";
import { db } from "@/lib/db/db.model";

const FN = ({ contentSeo }: { contentSeo: string }) => {
  const handlePageReload = () => {
    const data = localStorage.getItem("optQuery");
    console.log("🚀 ~ handlePageReload ~ data:", data);
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
  };

  useLayoutEffect(() => {
    handlePageReload();
  }, []);

  const dispatch = useAppDispatch();

  const handleBeforeUnload = (event: BeforeUnloadEvent) =>
    dispatch(beforeUnLoadThunk());

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const handleTets = async () => {
      const data = await db.topicQuestion
        .where("[subTopicTag+tag]")
        .equals(["machines", "machines-extended-1"])
        .first();

      const question = data?.questions?.map(
        (item) => item.answers.find((item) => item.correct)?.text
      );
      console.log("🚀 ~ handleTets ~ question:", question);
    };
    handleTets();
  }, []);

  return (
    <div className="flex-1 max-w-page sm:px-4 mx-auto">
      <Grid2 container>
        <Grid2
          size={{
            sm: 0,
            md: 0,
            xs: 12,
          }}
        >
          <HeaderMobile />
        </Grid2>
      </Grid2>
      <div className="sm:py-4" id="v4-study-main-view-0">
        <Grid2 container spacing={{ xs: 0, sm: 2 }} className="w-full h-full">
          <Grid2
            size={{
              sm: 3,
              xs: 0,
            }}
          >
            <QuestionGroup />
          </Grid2>
          <Grid2
            size={{
              sm: 9,
              xs: 12,
            }}
          >
            <MathJaxContext>
              <ContentGroup contentSeo={contentSeo} />
            </MathJaxContext>
          </Grid2>
        </Grid2>
      </div>
    </div>
  );
};

const StudyLayout = React.memo(FN);
export default StudyLayout;

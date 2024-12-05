"use client";
import { MtUiButton } from "@/components/button";
import { db } from "@/lib/db/db.model";
import SubTopicProgress from "@/lib/models/progress/subTopicProgress";
import Part from "@/lib/models/topics/part";
import { appInfoState } from "@/lib/redux/features/appInfo";
import { selectSubTopics, setOptQuery } from "@/lib/redux/features/study";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import initQuestionThunk from "@/lib/redux/repository/game/initQuestion";
import { revertPathName } from "@/utils/pathName";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const FinishPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { appInfo } = useAppSelector(appInfoState);

  const subTopicProgressId = useSearchParams().get("subTopicProgressId");
  console.log("🚀 ~ FinishPage ~ subTopicProgressId:", subTopicProgressId);
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

      console.log("🚀 ~ fetchSubTopicData ~ progress:", progress);

      const incompleteProgress = progress.find(
        (item) => !item.pass && item.part?.some((p) => p.status === 0)
      );
      console.log(
        "🚀 ~ fetchSubTopicData ~ incompleteProgress:",
        incompleteProgress
      );

      const nextPart = incompleteProgress?.part?.find((p) => p.status === 0);
      console.log("🚀 ~ fetchSubTopicData ~ nextPart:", nextPart);

      if (incompleteProgress) dispatch(selectSubTopics(incompleteProgress?.id));

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

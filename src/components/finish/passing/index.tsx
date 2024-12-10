import React from "react";
import { db } from "@/db/db.model";
import { selectSubTopics, setOptQuery } from "@/redux/features/study";
import { useAppDispatch } from "@/redux/hooks";
import initQuestionThunk from "@/redux/repository/game/initQuestion";
import { useRouter, useSearchParams } from "next/navigation";
import { MtUiButton } from "@/components/button";

const PassingFinishPage = () => {
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

      const nextPart = incompleteProgress?.part?.find((p) => p.status === 0);

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
    <div className="flex w-full flex-col justify-center items-center">
      <div className="w-full rounded-xl bg-[#7C6F5BAD] gap-6 items-center flex px-4 py-2 ">
        <p className="text-lg font-medium text-white">
          Passing Probability 42%
        </p>
        <div className="bg-white rounded-lg h-9 p-2 flex-1"></div>
      </div>

      <div className="flex pt-6 gap-4 max-w-[480px] w-full items-center">
        <MtUiButton className="text-primary border-primary" block size="large">
          Try Again
        </MtUiButton>
        <MtUiButton
          block
          size="large"
          onClick={fetchSubTopicData}
          type="primary"
        >
          Next Part
        </MtUiButton>
      </div>
    </div>
  );
};

export default PassingFinishPage;

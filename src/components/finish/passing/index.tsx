import { MtUiButton } from "@/components/button";
import { appInfoState } from "@/redux/features/appInfo";
import { handleTryAgain } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initQuestionThunk from "@/redux/repository/game/initQuestion";
import { revertPathName } from "@/utils/pathName";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const PassingFinishPage = ({
  nextPart,
  currentPartTag,
}: {
  currentPartTag: string;
  nextPart: {
    subTopicTag: string;
    tag: string;
  };
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [passing, setPassing] = useState(0);
  const topicName = useSearchParams().get("topic");
  const { appInfo } = useAppSelector(appInfoState);

  const handleNextPart = useCallback(async () => {
    if (nextPart.subTopicTag && nextPart.tag) {
      dispatch(
        initQuestionThunk({
          partTag: nextPart.tag,
          subTopicTag: nextPart.subTopicTag,
        })
      );

      const _href = revertPathName({
        href: `study/${topicName}?type=learn&subTopic=${nextPart.subTopicTag}&tag=${nextPart.tag}`,
        appName: appInfo.appShortName,
      });

      router.push(_href);
    }
  }, []);

  const handleTryAgainFn = useCallback(async () => {
    if (currentPartTag && nextPart.subTopicTag) {
      dispatch(
        handleTryAgain({
          turn: 2,
        })
      );
      dispatch(
        initQuestionThunk({
          partTag: currentPartTag,
          subTopicTag: nextPart.subTopicTag,
          isReset: true,
        })
      );

      const _href = revertPathName({
        href: `study/${topicName}?type=learn&subTopic=${nextPart.subTopicTag}&tag=${currentPartTag}`,
        appName: appInfo.appShortName,
      });
      router.push(_href);
    }
  }, [currentPartTag, nextPart.subTopicTag, topicName]);

  return (
    <div className="flex w-full flex-col justify-center items-center">
      <div className="w-full rounded-xl bg-[#7C6F5BAD] gap-6 items-center flex px-4 py-2 ">
        <p className="text-lg font-medium text-white">
          Passing Probability {passing}%
        </p>
        <div className="bg-white rounded-lg h-9 p-2 flex-1"></div>
      </div>

      <div className="flex pt-6 gap-4 max-w-[480px] w-full items-center">
        <MtUiButton
          className="text-primary border-primary"
          block
          size="large"
          onClick={handleTryAgainFn}
        >
          Try Again
        </MtUiButton>
        <MtUiButton block size="large" onClick={handleNextPart} type="primary">
          Next Part
        </MtUiButton>
      </div>
    </div>
  );
};

export default PassingFinishPage;

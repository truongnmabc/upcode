import { MtUiButton } from "@/components/button";
import { appInfoState } from "@/redux/features/appInfo";
import { gameState } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishQuestionThunk from "@/redux/repository/game/finishQuestion";
import nextQuestionThunk from "@/redux/repository/game/nextQuestion";
import { revertPathName } from "@/utils/pathName";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
const FN = () => {
  const [isFinish, setIsFinish] = useState(false);
  const { currentGame, subTopicProgressId, idTopic, listQuestion } =
    useAppSelector(gameState);
  const { appInfo } = useAppSelector(appInfoState);
  useEffect(() => {
    const isFinal = listQuestion.every((item) => item.localStatus === "pass");

    setIsFinish(isFinal);
  }, [listQuestion]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  return (
    <MtUiButton
      animated
      block
      onClick={() => {
        if (isFinish) {
          dispatch(
            finishQuestionThunk({
              subTopicProgressId: subTopicProgressId,
              topicId: idTopic,
            })
          );

          const _href = revertPathName({
            href: `/finish?subTopicProgressId=${subTopicProgressId}&mainTopic=${1}`,
            appName: appInfo.appShortName,
          });

          router.push(_href, {
            scroll: true,
          });

          return;
        }
        dispatch(
          nextQuestionThunk({
            idTopic: idTopic,
          })
        );
      }}
      disabled={!currentGame?.selectedAnswer}
      type="primary"
    >
      {isFinish ? "Finish" : "Continue"}
    </MtUiButton>
  );
};
const BottomBtnSticky = React.memo(FN);
export default BottomBtnSticky;

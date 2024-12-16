import { useIsMobile } from "@/hooks/useIsMobile";
import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";
import ctx from "@/utils/mergeClass";
import "./progress.css";
const ProgressQuestion = () => {
  const { listQuestion, indexCurrentQuestion, currentGame } =
    useAppSelector(gameState);
  const isMobile = useIsMobile();

  if (isMobile) return <></>;
  return (
    <div className="flex w-full h-1">
      {listQuestion.map((item, index) => (
        <div
          key={index}
          className={ctx("h-full w-full", {
            "bg-[#21212133]": item.localStatus === "new",
            "bg-[#5497FF]": currentGame.id === item.id,
            "bg-[#07C58C]":
              item.localStatus === "correct" && indexCurrentQuestion !== index,
            "bg-[#FF746D]":
              item.localStatus === "incorrect" &&
              indexCurrentQuestion !== index,
          })}
        ></div>
      ))}
    </div>
  );
};

export default ProgressQuestion;

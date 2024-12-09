import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { gameState } from "@/lib/redux/features/game";
import { useAppSelector } from "@/lib/redux/hooks";
import ctx from "@/utils/mergeClass";
import "./progress.css";
const ProgressQuestion = () => {
  const { listQuestion, indexCurrentQuestion } = useAppSelector(gameState);
  const isMobile = useIsMobile();

  if (isMobile) return <></>;
  return (
    <div className="flex w-full h-1">
      {listQuestion.map((item, index) => (
        <div
          key={index}
          className={ctx("h-full w-full", {
            "bg-[#21212133]": item.localStatus === "lock",
            "bg-[#5497FF]":
              indexCurrentQuestion === index || item.localStatus === "unlock",
            "bg-[#07C58C]":
              item.localStatus === "pass" && indexCurrentQuestion !== index,
            "bg-[#FF746D]":
              item.localStatus === "miss" && indexCurrentQuestion !== index,
          })}
        ></div>
      ))}
    </div>
  );
};

export default ProgressQuestion;

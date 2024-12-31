import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";
import ctx from "@/utils/mergeClass";

type IProps = {
    isActions?: boolean;
};
const ProgressQuestion: React.FC<IProps> = ({ isActions = false }) => {
    const { listQuestion, indexCurrentQuestion, currentGame } =
        useAppSelector(gameState);

    return (
        <div className="sm:flex rounded-lg hidden bg-[#21212133] overflow-hidden w-full h-[6px]">
            {listQuestion.map((item, index) => (
                <div
                    key={index}
                    className={ctx("h-2  w-full", {
                        "bg-[#21212185]":
                            isActions && item.localStatus !== "new",
                        "bg-[#5497FF] ":
                            currentGame.id === item.id && !isActions,
                        "bg-[#07C58C]":
                            item.localStatus === "correct" &&
                            indexCurrentQuestion !== index &&
                            !isActions,
                        "bg-[#FF746D]":
                            item.localStatus === "incorrect" &&
                            indexCurrentQuestion !== index &&
                            !isActions,
                    })}
                ></div>
            ))}
        </div>
    );
};

export default ProgressQuestion;

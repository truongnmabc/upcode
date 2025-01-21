import BtnNextQuestion from "@/components/bottomActions/next/learn";
import { useAppSelector } from "@/redux/hooks";
import NextQuestionFinalPage from "./final";
import { selectGameDifficultyLevel } from "@/redux/features/game.reselect";

const NextQuestionCustomTest = () => {
    const gameDifficultyLevel = useAppSelector(selectGameDifficultyLevel);
    if (gameDifficultyLevel === "exam") return <NextQuestionFinalPage />;
    return <BtnNextQuestion />;
};

export default NextQuestionCustomTest;

import BtnNextQuestion from "@/components/bottomActions/next/learn";
import { useAppSelector } from "@/redux/hooks";
import NextQuestionFinalPage from "./final";
import {
    selectCurrentQuestionIndex,
    selectGameDifficultyLevel,
    selectListQuestion,
} from "@/redux/features/game.reselect";

const NextQuestionCustomTest = () => {
    const gameDifficultyLevel = useAppSelector(selectGameDifficultyLevel);
    const index = useAppSelector(selectCurrentQuestionIndex);
    const list = useAppSelector(selectListQuestion);
    if (index === list.length - 1) return null;
    if (gameDifficultyLevel === "exam") return <NextQuestionFinalPage />;
    return <BtnNextQuestion />;
};

export default NextQuestionCustomTest;

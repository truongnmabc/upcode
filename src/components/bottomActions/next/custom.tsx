import BtnNextQuestion from "@/components/bottomActions/next/learn";
import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";
import NextQuestionFinalPage from "./final";

const NextQuestionCustomTest = () => {
    const { feedBack } = useAppSelector(gameState);
    if (feedBack === "exam") return <NextQuestionFinalPage />;
    return <BtnNextQuestion />;
};

export default NextQuestionCustomTest;

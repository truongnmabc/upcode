import BtnNextQuestion from "@/components/study/mainStudyView/bottomBtn/btnNextQuestion";
import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";
import NextQuestionFinalPage from "../../../final_test/_components/nextQuestionFinal";

const NextQuestionCustomTest = () => {
    const { feedBack } = useAppSelector(gameState);
    if (feedBack === "exam") return <NextQuestionFinalPage />;
    return <BtnNextQuestion />;
};

export default NextQuestionCustomTest;

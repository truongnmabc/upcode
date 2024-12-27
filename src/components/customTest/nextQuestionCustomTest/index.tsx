import NextQuestionDiagnostic from "@/components/diagnosticTest/nextQuestionDiagnostic";
import NextQuestionFinalPage from "@/components/finalTest/nextQuestionFinal";
import BtnNextQuestion from "@/components/study/contentGroup/mainStudyView/bottomBtn/btnNextQuestion";
import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";

const NextQuestionCustomTest = () => {
    const { feedBack } = useAppSelector(gameState);
    if (feedBack === "exam") return <NextQuestionFinalPage />;
    return <BtnNextQuestion />;
};

export default NextQuestionCustomTest;

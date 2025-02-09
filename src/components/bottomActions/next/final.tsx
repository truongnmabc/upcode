import { MtUiButton } from "@/components/button";
import { setCurrentQuestion } from "@/redux/features/game";
import {
    selectCurrentQuestionIndex,
    selectListQuestion,
} from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const NextQuestionFinalPage = () => {
    const indexCurrentQuestion = useAppSelector(selectCurrentQuestionIndex);

    const listQuestions = useAppSelector(selectListQuestion);

    const dispatch = useAppDispatch();

    const handleFinish = () => {
        dispatch(setCurrentQuestion(indexCurrentQuestion + 1));
    };

    return (
        <MtUiButton
            animated
            block
            onClick={handleFinish}
            type="primary"
            disabled={indexCurrentQuestion + 1 === listQuestions.length}
            className="py-3 px-8"
        >
            Continue
        </MtUiButton>
    );
};

export default NextQuestionFinalPage;

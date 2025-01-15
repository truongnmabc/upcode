import { MtUiButton } from "@/components/button";
import { viewTest } from "@/redux/features/game";
import {
    selectIndexCurrentQuestion,
    selectListQuestion,
} from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const NextQuestionFinalPage = () => {
    const indexCurrentQuestion = useAppSelector(selectIndexCurrentQuestion);

    const listQuestions = useAppSelector(selectListQuestion);

    const dispatch = useAppDispatch();

    const handleFinish = () => {
        dispatch(viewTest(indexCurrentQuestion + 1));
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

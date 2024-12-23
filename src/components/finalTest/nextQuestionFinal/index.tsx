import { MtUiButton } from "@/components/button";
import { gameState, viewTest } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const NextQuestionFinalPage = () => {
    const { indexCurrentQuestion } = useAppSelector(gameState);

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
            className="py-3 px-8"
        >
            Continue
        </MtUiButton>
    );
};

export default NextQuestionFinalPage;

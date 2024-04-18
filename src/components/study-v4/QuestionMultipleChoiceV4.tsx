import Question, { getNumberChoiceSelected } from "../../models/Question";

const QuestionMultipleChoiceV4 = ({ currentQuestion }: { currentQuestion: Question }) => {
    return (
        currentQuestion.correctNums > 1 && (
            <div className="select-multiple-question-title">
                Correct answers: {getNumberChoiceSelected(currentQuestion.choices)}/{currentQuestion.correctNums} selected
            </div>
        )
    );
};

export default QuestionMultipleChoiceV4;

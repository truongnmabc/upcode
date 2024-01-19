import Question from "../../models/Question";

const QuestionMutipleChoiceV4 = ({ currentQuestion }: { currentQuestion: Question }) => {
    return (
        currentQuestion.correctNums > 1 && (
            <div className="select-multiple-question-title">
                Correct answers: {currentQuestion.getNumberChoiceSelected()}/{currentQuestion.correctNums} selected
            </div>
        )
    );
};

export default QuestionMutipleChoiceV4;

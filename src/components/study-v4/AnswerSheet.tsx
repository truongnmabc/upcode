import { GameState } from "../../redux/features/game";
import { useDispatch } from "react-redux";
import Config from "../../config";
import Question from "../../models/Question";
import IWebData from "@/types/webData";
import "./AnswerSheet.scss";
import { goToQuestion } from "@/redux/reporsitory/game.repository";

const createTempData = (size: number) => {
    return Array.apply(null, Array(size)).map((t) => ({ questionStatus: Config.QUESTION_NOT_ANSWERED }));
};
const AnswerSheet = ({ gameState, contentData }: { gameState: GameState; contentData: IWebData }) => {
    const isTest = contentData.gameType != Config.TOPIC_GAME;
    let isFinish = gameState.isFinishGame;
    let questions = gameState.questions.length > 0 ? gameState.questions : createTempData(isTest ? 50 : 10);
    const dispatch = useDispatch();
    let maximumQuestionIndexIsAnswered = 0;
    if (isTest) {
        for (let q of gameState.questions) {
            // phải trả lời xong thì mới next sang câu tiếp nên cần
            // đảm bảo question nào có tồn tại choice được selected thì tức là nó đã được trả lời
            // trường hợp đang làm ở câu mới nhất xong bấm sang câu khác trước đó thì logic này vẫn đúng
            let _q = new Question(q); //khs nó bị mất kiểu object này
            let correctNum = _q.getCorrectNum();
            let listSelected = q.choices.filter((c) => c.selected);
            if (listSelected.length == correctNum) {
                maximumQuestionIndexIsAnswered++;
            }
        }
        // trường hợp nó ở câu mới nhất đã trả lời xong nhưng không next
        // mà lại bấm về câu cũ để xem thì khi đó nó có thể bấm sang
        // câu mới nhất sau câu đã trả lời mà chưa next
        // còn nếu nó chưa trả lời mà bấm lùi về câu trước thì nó chỉ coi như câu mới nhất
        // là câu mà nó đang xem nhưng chưa trả lời thôi
        maximumQuestionIndexIsAnswered += 1;
    }
    return (
        <div className="v4-answer-sheet-container-0 v4-border-radius" id="v4-answer-sheet">
            <h3 className="v4-font-semi-bold">Your Progress</h3>
            <div className="v4-answer-sheet-grid-question-0">
                {questions.map((q, index) => {
                    // chỉ có phần test được phép chọn và chỉ được chọn câu hỏi đã trả lời qua rồi => disable các câu còn lại
                    let disable = isTest ? index >= maximumQuestionIndexIsAnswered : true;
                    let status = "";
                    if (
                        q.questionStatus == Config.QUESTION_ANSWERED_CORRECT ||
                        q.questionStatus == Config.QUESTION_ANSWERED_INCORRECT
                    )
                        status = " answered ";

                    if (gameState.gameType == Config.TOPIC_GAME || isFinish == 1) {
                        // phần học hoặc finish sẽ hiện đáp án đúng sai
                        if (q.questionStatus == Config.QUESTION_ANSWERED_CORRECT) status = " correct ";
                        else if (q.questionStatus == Config.QUESTION_ANSWERED_INCORRECT) status = " incorrect ";
                    }
                    return (
                        <div
                            key={index}
                            // finish game bỏ active ở câu hỏi cuối và disable chọn câu khác ở phần test
                            className={`v4-answer-sheet-grid-item ${
                                gameState.indexActive === index && !(isFinish == 1) ? "current" : ""
                            } ${disable || isFinish == 1 ? "disabled" : ""} ${status}`}
                            onClick={(e) => {
                                if (isTest) {
                                    if (index < maximumQuestionIndexIsAnswered) {
                                        if (index != gameState.indexActive && !(isFinish == 1)) {
                                            // không cho bấm vào câu hiện tại đang làm
                                            dispatch(goToQuestion(index));
                                        }
                                    }
                                }
                            }}
                        >
                            {index + 1}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AnswerSheet;

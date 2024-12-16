import Config from "../../config";
import { IChoice } from "../../models/Choice";
import V4QuestionContent from "./V4QuestionContent";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import { getSession } from "../../config/config_web";
import "./ChoicePannelV4.scss";
import { TextContentType, isMathJaxContent } from "../../utils/v4_question";
import Question from "../../models/Question";
import { useEffect } from "react";
const tester = getSession(Config.TESTER_KEY);
const TEMP_LIST_ANSWER: IChoice[] = [
    { id: -1, content: "", questionId: 0, isCorrect: false, selected: false, explanation: "" },
    { id: -1, content: "", questionId: 0, isCorrect: false, selected: false, explanation: "" },
    { id: -1, content: "", questionId: 0, isCorrect: false, selected: false, explanation: "" },
    { id: -1, content: "", questionId: 0, isCorrect: false, selected: false, explanation: "" },
];
const ChoicesPanelV4 = ({
    bucket, // bucket này để truyền vào V4QuestionContent thôi
    isReviewAnswer = false, // nếu là trang review answer của phần học
    currentQuestion, // câu hỏi đang xét
    onChoiceSelected = (c: IChoice) => {}, // hàm xử lý khi click chọn đáp án
    allowShowAnswer = true, // có cho phép hiện kết quả hay không
    place = "study",
}: {
    bucket: string;
    isReviewAnswer?: boolean;
    currentQuestion: Question;
    onChoiceSelected?: (choice: IChoice, useKeyboard?: boolean) => void;
    allowShowAnswer?: boolean;
    place?: "question" | "study" | "review";
}) => {
    let listAnswers = JSON.parse(JSON.stringify(currentQuestion.choices ?? []));
    if (listAnswers.length == 0) listAnswers = TEMP_LIST_ANSWER; // gán như này để hiện luôn đáp án
    let thisQuestionIsDone = false;
    if (
        currentQuestion.questionStatus == Config.QUESTION_ANSWERED_INCORRECT ||
        currentQuestion.questionStatus == Config.QUESTION_ANSWERED_CORRECT ||
        isReviewAnswer
    ) {
        thisQuestionIsDone = true;
    }

    const isMultichoices = currentQuestion.correctNums > 1;
    return (
        <div className={"v4-choices-panel-0"}>
            {listAnswers.map((_choice, index) => {
                let showCss = "";
                let choice = { ..._choice };
                if (thisQuestionIsDone) {
                    // màn này cho phép hiện đáp án
                    if (allowShowAnswer || isReviewAnswer) {
                        // nếu đã trả lời xong (update tại ON_CHOOSE_ANSWER)
                        if (choice.isCorrect) showCss = " correct "; // hiện đáp án đúng
                        if (choice.selected && !choice.isCorrect) showCss = " failed "; // hiện lựa chọn sai
                    }
                }
                return (
                    <AnswerPanel
                        showCss={showCss}
                        choice={choice}
                        bucket={bucket}
                        place={place}
                        allowShowAnswer={allowShowAnswer}
                        isReviewAnswer={isReviewAnswer}
                        onChoiceSelected={onChoiceSelected}
                        thisQuestionIsDone={thisQuestionIsDone}
                        key={index}
                        index={index}
                        isMultichoices={isMultichoices}
                    />
                );
            })}
        </div>
    );
};

const AnswerPanel = ({
    choice,
    showCss,
    bucket,
    place,
    thisQuestionIsDone,
    allowShowAnswer,
    isReviewAnswer,
    onChoiceSelected,
    index,
    isMultichoices,
}: {
    choice: IChoice;
    showCss: string;
    bucket: string;
    place: "question" | "study" | "review";
    thisQuestionIsDone: boolean;
    allowShowAnswer: boolean;
    isReviewAnswer: boolean;
    onChoiceSelected: any;
    index: number;
    isMultichoices: boolean;
}) => {
    let disableSelectAnswer =
        (thisQuestionIsDone && // TEST_GAME thi cho phep thay doi dap an duoc (đã cho hiện đáp án rồi thì không cho chọn lại)
            allowShowAnswer) ||
        choice.selected ||
        isReviewAnswer;

    useEffect(() => {
        const handleEnterEvent = (event: KeyboardEvent) => {
            if (Config.V4KEYBOARD.includes(event.code)) {
                localStorage.setItem("useKeyboard", "true");
            }
            if (event.key === (index + 1).toString()) {
                if (onChoiceSelected) {
                    onChoiceSelected(choice, true);
                }
            }
        };
        document.removeEventListener("keydown", handleEnterEvent, true);
        if (!disableSelectAnswer) {
            if (choice.id != -1 && !!choice.content) {
                document.addEventListener("keydown", handleEnterEvent, true);
            }
        }
        return () => {
            document.removeEventListener("keydown", handleEnterEvent, true);
        };
    }, [disableSelectAnswer, choice]);
    return (
        <div
            className={
                "v4-answer-button v4-border-radius " +
                (isReviewAnswer ? " review " : "") +
                (choice.selected ? " selected " : "") +
                showCss +
                (tester && choice.isCorrect ? " correct " : "")
            }
            onClick={(e) => {
                // nếu đã trả lời xong và đáp án này đã chọn hoặc dùng để hiện đáp án end test thì không handle click nữa
                if (disableSelectAnswer) {
                    return;
                }
                if (choice.id != -1 && !!choice.content)
                    // viết như này để cho trường hợp đang là TEMP_LIST_ANSWER
                    onChoiceSelected(choice);
            }}
        >
            <div className="v4-answered-content v4-flex">
                {isMultichoices ? (
                    <div className="check-box">
                        <Checked />
                    </div>
                ) : (
                    getIcon((thisQuestionIsDone && allowShowAnswer) || isReviewAnswer, choice)
                )}
                <div className="v4-answer-button-content">
                    <V4QuestionContent
                        content={choice.content}
                        type={TextContentType.answer}
                        bucket={bucket}
                        renderMathJax={isMathJaxContent(choice.content)}
                        place={place}
                    />
                </div>
            </div>
        </div>
    );
};
const getIcon = (condition: boolean, choice: IChoice) => {
    let _sx = { width: "20px", height: "20px" };
    if (condition) {
        // hiện đáp án với trường hợp review hoặc cho phép hiện đáp án sau khi đã trả lời xong
        if (choice.selected) {
            if (!choice.isCorrect) return <CancelRoundedIcon htmlColor="#fb7072" sx={_sx} />; //chọn sai
            else return <CheckCircleRoundedIcon htmlColor="#00c17c" sx={_sx} />; // chọn đúng
        } else {
            if (choice.isCorrect) return <CheckCircleRoundedIcon htmlColor="#00c17c" sx={_sx} />;
            return <RadioButtonUncheckedRoundedIcon htmlColor="#AEAEB2" sx={_sx} />; // không chọn
        }
    } else {
        if (choice.selected) return <RadioButtonCheckedRoundedIcon htmlColor="#AEAEB2" sx={_sx} />;
        else return <RadioButtonUncheckedRoundedIcon htmlColor="#AEAEB2" sx={_sx} />;
    }
};

const Checked = () => {
    return (
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 4.5L5.15385 8L12.5 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
};

export default ChoicesPanelV4;

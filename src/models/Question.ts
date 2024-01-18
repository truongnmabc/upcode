import Config from "@/config";
import Choice, { IChoice } from "./Choice";

class Question {
    id: number;
    choices: IChoice[];
    correctNums: number;
    explanation: string;
    hint: string;
    image: string;
    index: number;
    paragraphContent: string;
    paragraphId: number;
    progress: number[]; // v4
    question: string;
    questionStatus: number;
    shortId: number;

    constructor(object: any = {}) {
        this.id = object.id;
        this.shortId = object.shortId ?? 0;
        this.question = object.question ?? "";
        this.hint = object.hint ?? "";
        this.image = object.image ?? "";
        this.explanation = object.explanation ?? "";
        this.questionStatus = object.questionStatus ?? Config.QUESTION_NOT_ANSWERED;
        this.choices = this.getListChoices(object.answers, object.choices, this.id);
        if (this.choices.length <= 0 && object.listChoices?.length > 0) {
            this.choices = [];
            object.listChoices.forEach((choice, index) => {
                this.choices.push(
                    new Choice({
                        content: choice.choice,
                        isCorrect: choice.isCorrect,
                        id: index,
                        questionId: this.id,
                        selected: choice.selected,
                    })
                );
            });
        }
        this.index = object.index ?? -1;
        this.paragraphId = object.paragraphId ?? -1;
        this.paragraphContent = object.paragraphContent ?? object.paragraph ?? "";
        this.correctNums = this.getCorrectNum();
        this.progress = object.progress ?? [];
        if (!Array.isArray(this.progress)) this.progress = []; // cfl với dữ liệu cũ trường này là object mà không phải array nên thêm dòng này để convert về array
        if (object.quiz?.description?.length) {
            this.paragraphContent = object.quiz.description;
        }
    }

    getListChoices(answers, choices, questionId) {
        var _a;
        let listChoices = new Array();
        if (answers && choices) {
            for (let i = 0; i < answers.length; i++) {
                let correctChoice = new Choice({
                    content: answers[i],
                    isCorrect: true,
                    questionId: questionId,
                    id: listChoices.length,
                });
                listChoices.push(correctChoice);
            }
            for (let i = 0; i < choices.length; i++) {
                let wrongChoice = new Choice({
                    content: choices[i],
                    isCorrect: false,
                    questionId: questionId,
                    id: listChoices.length,
                });
                listChoices.push(wrongChoice);
            }
        } else {
            if (choices) {
                for (let i = 0; i < choices.length; i++) {
                    let wrongChoice = new Choice({
                        content: choices[i]["content"],
                        isCorrect: choices[i]["isCorrect"],
                        questionId: choices[i]["questionId"],
                        selected: !!choices[i]["selected"],
                        id: (_a = choices[i]["id"]) !== null && _a !== void 0 ? _a : i,
                    });
                    listChoices.push(wrongChoice);
                }
            } else {
            }
        }
        return listChoices;
    }
    getCorrectNum() {
        this.correctNums = 0;
        for (let i = 0; i < this.choices.length; i++) {
            if (this.choices[i].isCorrect) this.correctNums++;
        }
        return this.correctNums;
    }

    static fromJs(questionJS) {
        if (typeof questionJS === "string") {
            return new Question(JSON.parse(questionJS));
        } else {
            let question = Object.create(Question.prototype);
            return new Question(Object.assign(question, questionJS));
        }
    }
    getNumberChoiceSelected() {
        let num = 0;
        for (let i = 0; i < this.choices.length; i++) {
            if (this.choices[i].selected) num++;
        }
        return num;
    }
}
export default Question;

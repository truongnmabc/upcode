export interface IChoice {
    id: number;
    content: string;
    questionId: number;
    isCorrect: boolean;
    selected: boolean;
    explanation: string;
}
export class Choice implements IChoice {
    id: number;
    content: string;
    questionId: number;
    isCorrect: boolean;
    selected: boolean;
    explanation: string;

    constructor(choice: any = {}) {
        this.id = choice.id ?? -1;
        this.content = choice.content ?? "";
        this.questionId = choice.questionId ?? -1;
        this.isCorrect = choice.isCorrect ?? false;
        this.selected = choice.selected ?? false;
        this.explanation = choice.explanation ?? "";
    }
}
export default Choice;

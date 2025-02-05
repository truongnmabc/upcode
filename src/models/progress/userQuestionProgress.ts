import { IAnswer } from "../question/questions";

export interface IUserQuestionProgress {
    selectedAnswers: Omit<IAnswer, "explanation" | "index" | "text">[];
    id: number;
    parentId: number;
    level: number;
}

import { IQuestion } from "../question/questions";

export interface ITestQuestion {
    parentId: number;
    question: IQuestion[];
}

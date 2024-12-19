import { IQuestion } from "../question/questions";

export interface ITestQuestion {
    parentId: number;
    question: IQuestion[];
    duration: number;
    isPaused: boolean;
    startTime: number;
    remainTime: number;
}

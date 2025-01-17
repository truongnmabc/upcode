import { IQuestion } from "../question/questions";
import { IGroupExam } from "./tests";

export interface ITestQuestion {
    parentId: number;
    id?: number;
    question: IQuestion[];
    duration: number;
    isPaused: boolean;
    startTime: number;
    remainTime: number;
    elapsedTime: number;
    type: "finalTests" | "practiceTests" | "diagnosticTest" | "customTets";
    feedBack?: "newbie" | "expert" | "exam";
    passing?: number;
    count?: number;
    subject?: number[];
    status?: number;
    turn: number;
    topicIds?: number[];
    groupExamData?: IGroupExam[];
}

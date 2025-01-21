import { IQuestion } from "../question/questions";
import { IGroupExam } from "./tests";

export interface ITestQuestion {
    parentId: number;
    id?: number;
    question: IQuestion[];
    totalDuration: number;
    isGamePaused: boolean;
    startTime: number;
    remainingTime: number;
    elapsedTime: number;
    gameMode: "finalTests" | "practiceTests" | "diagnosticTest" | "customTets";
    gameDifficultyLevel?: "newbie" | "expert" | "exam";
    passingThreshold?: number;
    count?: number;
    subject?: number[];
    status?: number;
    attemptNumber: number;
    topicIds?: number[];
    groupExamData?: IGroupExam[];
}

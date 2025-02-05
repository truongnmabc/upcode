import { ITopicQuestion } from "../question/topicQuestion";
import { IGroupExam } from "./tests";

export interface ITestQuestion {
    id: number;
    question: ITopicQuestion[];
    totalDuration: number;
    isGamePaused: boolean;
    startTime: number;
    remainingTime?: number;
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
    isPaused: boolean;
}

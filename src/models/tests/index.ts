import { IGroupExam } from "./tests";

export type IGameMode =
    | "finalTests"
    | "practiceTests"
    | "diagnosticTest"
    | "customTets"
    | "learn";

export interface ITestBase {
    id: number;
    totalDuration: number;
    isGamePaused: boolean;
    startTime: number;
    remainingTime?: number;
    elapsedTime: number;
    gameMode: IGameMode;
    gameDifficultyLevel?: "newbie" | "expert" | "exam";
    passingThreshold: number;
    totalQuestion: number;
    status: number;
    attemptNumber: number;
    topicIds: number[];
    groupExamData: IGroupExam[];
    createDate?: number;
}

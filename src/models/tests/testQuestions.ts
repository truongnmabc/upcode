import { ICurrentGame } from "../game/game";
import { IQuestion } from "../question/questions";
import { IGroupExam } from "./tests";

export interface ITestQuestion {
    parentId: number;
    id?: number;
    // Danh sách câu hỏi
    question: IQuestion[];
    duration: number;
    isPaused: boolean;
    startTime: number;
    remainTime: number;
    type: "finalTests" | "practiceTests" | "diagnosticTest" | "customTets";
    feedBack?: "newbie" | "expert" | "exam";
    passing?: number;
    count?: number;
    subject?: number[];
    status?: number;
    belowFifty?: Record<string, ICurrentGame[]>;
    aboveFifty?: Record<string, ICurrentGame[]>;
    turn: number;

    topicIds?: number[];
    groupExamData?: IGroupExam[];
}

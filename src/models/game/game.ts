import { IAnswer, IQuestion } from "@/models/question/questions";
import { IStatusAnswer } from "@/components/study/contentGroup/mainStudyView/statusAnswer/statusAnswer";

export interface ICurrentGame
    extends Omit<
        IQuestion,
        | "createDate"
        | "databaseId"
        | "hasChild"
        | "hint"
        | "image"
        | "lastUpdate"
        | "oldId"
        | "paragraphId"
    > {
    localStatus?: IStatusAnswer;
    selectedAnswer?: IAnswer | null;
    turn?: number;
    tag?: string;
}

export interface IGameReducer {
    currentGame: ICurrentGame;
    listQuestion: ICurrentGame[];
    idTopic: number;
    indexCurrentQuestion: number;
    listWrongAnswers: number[];
    isFirst: boolean;
    subTopicProgressId: number;
    turn: number;
    time: number;
    type: "test" | "learn";
    isPaused: boolean;
    remainTime: number;
    belowFifty: Record<string, ICurrentGame[]>;
    aboveFifty: Record<string, ICurrentGame[]>;
}

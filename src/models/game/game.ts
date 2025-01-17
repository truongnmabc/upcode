import { IAnswer, IQuestion } from "@/models/question/questions";
import { IStatusAnswer } from "@/components/statusAnswer";
import { IFeedBack } from "@/app/[appShortName]/[state]/custom_test/_components/modalSetting";

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
    feedBack?: IFeedBack;
    passing?: number;
    image?: string;
    icon?: string;
    type?: "test" | "learn";
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
    indexSubTopic: number;
    remainTime: number;
    feedBack?: IFeedBack;
    passing?: number;
    isFinishGame?: boolean;
    isEndTimeTest?: boolean;
    shouldListenEventKeyboard?: boolean;
}

import { IGameMode } from "../tests";
import { IStatusAnswer } from "./questions";

export interface IAnswer {
    correct: boolean;
    explanation: string;
    id: number;
    index: number;
    text: string;
    turn: number;
    parentId: number;
    type: IGameMode;
}
export interface IParagraph {
    id: number;
    text: string;
    status?: number;
    contentType?: number;
    syncStatus?: number;
}
export interface IQuestionBase {
    id: number;
    parentId: number;
    icon: string;
    contentType: number;
    tag: string;
    answers: IAnswer[];
    explanation: string;
    text: string;
    image: string;
    level: number;
    paragraphId: number;
    status: number;
    syncStatus?: number;
    paragraph?: IParagraph;
    partId: number;
    subTopicId: number;
    subTopicTag: string;
    topicId: number;
}

export interface IQuestionOpt extends IQuestionBase {
    localStatus?: IStatusAnswer;
    selectedAnswer?: IAnswer | null;
    turn?: number;
}

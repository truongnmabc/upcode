import { IStatusAnswer } from "@/components/statusAnswer";
import { IAnswer, IQuestion } from "./questions";

type IParagraph = {
    text: string;
    id: number;
};
export interface ITopicQuestion {
    id: number;
    parentId: number;
    name: string;
    icon: string;
    contentType: number;
    orderIndex?: number;
    tag?: string;
    gameMode: number;
    topics: unknown;
    questions?: IQuestion[];
    status: number;
    subTopicTag?: string;
    attemptNumber?: number;
    paragraph?: IParagraph;
    level: number;
    subTopicId: number;
}

export interface ITopicQuestionState extends ITopicQuestion {
    localStatus?: IStatusAnswer;
    selectedAnswer?: IAnswer | null;
    partId: number;
}

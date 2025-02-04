import { IQuestion } from "./questions";

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
}
export default class TopicQuestion implements ITopicQuestion {
    id: number;
    parentId: number;
    contentType: number;
    icon: string;
    name: string;
    orderIndex: number;
    questions?: IQuestion[];
    tag: string;
    gameMode: number;
    topics: unknown;
    status: number;
    subTopicTag?: string;
    attemptNumber?: number;

    constructor(object: Partial<ITopicQuestion> = {}) {
        this.id = object.id ?? -1;
        this.parentId = object.parentId ?? -1;
        this.parentId = object.parentId ?? -1;
        this.contentType = object.contentType ?? -1;
        this.icon = object.icon ?? "";
        this.questions = object.questions;
        this.tag = object.tag ?? "";
        this.orderIndex = object.orderIndex ?? 0;
        this.name = object.name ?? "";
        this.gameMode = object.gameMode ?? 3;
        this.status = object.status ?? 0;
        this.attemptNumber = object.attemptNumber ?? 1;
    }
}

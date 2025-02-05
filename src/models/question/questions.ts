import { IStatusAnswer } from "@/components/statusAnswer";

export interface IAnswer {
    correct: boolean;
    explanation: string;
    id: number;
    index: number;
    text: string;
    turn?: number;
    parentId?: number;
    type: "test" | "learn";
}
export interface IParagraph {
    id: number;
    lastUpdate: number;
    createDate: number;
    text: string;
    status: number;
    databaseId: number;
    rootTopicId: number;
    oldId: number;
    contentType: number;
    syncStatus: number;
}
export interface IQuestion {
    answers: IAnswer[];
    contentType?: number;
    createDate?: number;
    databaseId?: number;
    explanation: string;
    hasChild?: boolean;
    hint: string;
    id: number;
    image: string;
    lastUpdate?: number;
    level: number;
    oldId?: number;
    paragraphId?: number;
    parentId: number;
    status: number;
    syncStatus: number;
    text: string;
    localStatus?: IStatusAnswer;
    selectedAnswer?: IAnswer | null;
    turn?: number;
    tag?: string;
    icon?: string;

    paragraph?: IParagraph;
}

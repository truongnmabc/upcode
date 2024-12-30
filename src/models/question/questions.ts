import { IStatusAnswer } from "@/components/study/mainStudyView/statusAnswer/statusAnswer";

export interface IAnswer {
    correct: boolean;
    explanation: string;
    id: number;
    index: number;
    text: string;
    turn?: number;
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
}

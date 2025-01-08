import { IAnswer, IQuestion } from "../question/questions";

export interface IUserQuestionProgress
    extends Omit<
        IQuestion,
        | "createDate"
        | "databaseId"
        | "hasChild"
        | "hint"
        | "lastUpdate"
        | "oldId"
        | "paragraphId"
        | "index"
        | "appId"
    > {
    selectedAnswers?: IAnswer[];
    type?: "test" | "learn";
}

export default class UserQuestionProgress implements IUserQuestionProgress {
    answers: IAnswer[] = [];
    contentType: number = 0;
    explanation: string = "";
    id: number = 0;
    level: number = 0;
    parentId: number = 0;
    selectedAnswers?: IAnswer[];
    image: string;
    status: number = 0;
    syncStatus: number = 0;
    text: string = "";
    type: "test" | "learn";
    constructor(obt: Partial<IUserQuestionProgress> = {}) {
        this.answers = obt.answers ?? this.answers;
        this.contentType = obt.contentType ?? this.contentType;
        this.explanation = obt.explanation ?? this.explanation;
        this.id = obt.id ?? this.id;
        this.level = obt.level ?? this.level;
        this.parentId = obt.parentId ?? this.parentId;
        this.selectedAnswers = obt.selectedAnswers;
        this.status = obt.status ?? this.status;
        this.syncStatus = obt.syncStatus ?? this.syncStatus;
        this.text = obt.text ?? this.text;
        this.type = obt.type ?? "learn";
        this.image = obt.image ?? "";
    }
}

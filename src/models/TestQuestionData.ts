export interface ITestQuestionData {
    topicId: number;
    questionNum: number;
    // requiredPass: number;
    questionIds: number[];
}
export class TestQuestionData implements ITestQuestionData {
    topicId: number;
    questionNum: number;
    // requiredPass: number;
    questionIds: number[];

    constructor(object?: any) {
        this.topicId = object.topicId ?? -1;
        this.questionNum = object.questionNum ?? -1;
        // this.requiredPass = object.requiredPass ?? -1;
        this.questionIds = object.questionIds ?? [];
    }
}

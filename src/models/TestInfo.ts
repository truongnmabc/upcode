export interface ITestInfo {
    slug: string; // lưu slug của bài test này
    appId: number; //
    id: string; //
    passPercent: number; //
    tag: string;
    timeTest: number;
    title: string;
    totalQuestion: number;
    stateTag: string;
    img?: string;
}

export default class TestInfo implements ITestInfo {
    appId: number;
    id: string;
    passPercent: number;
    slug: string;
    tag: string;
    timeTest: number;
    title: string;
    totalQuestion: number;
    stateTag: string;

    constructor(object?: any) {
        this.appId = object.appId ? object.appId : -1;
        this.id = object.appId + "-" + (!!object?.stateTag ? object.stateTag + "-" : "") + object.tag ?? "-1";
        this.passPercent = object.passPercent ? object.passPercent : 100;
        this.slug = object.slug ?? "";
        this.tag = object.tag ?? "";
        this.timeTest = object.timeTest ?? -1;
        this.title = object.title ? object.title : "";
        this.totalQuestion = object.testQuestionNum ?? 0;
        this.stateTag = object.stateTag;
    }
}

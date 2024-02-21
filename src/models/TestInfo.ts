import { ITestQuestionData } from "./TestQuestionData";

export interface ITestInfo {
    slug: string; // lưu slug của bài test này
    appId: number; //
    id: string; //
    lastUpdate: number; //
    passPercent: number; //
    questionIds: number[];
    shortId: number;
    stateId: number;
    tag: string;
    testQuestionData: ITestQuestionData[];
    timeTest: number;
    title: string;
    totalQuestion: number;
}

export default class TestInfo implements ITestInfo {
    slug: string;
    appId: number;
    id: string;
    lastUpdate: number;
    passPercent: number;
    questionIds: number[];
    shortId: number;
    stateId: number;
    tag: string;
    testQuestionData: ITestQuestionData[];
    timeTest: number;
    title: string;
    totalQuestion: number;

    constructor(object?: any) {
        this.slug = object.slug ?? "";
        this.appId = object.appId ? object.appId : -1;
        this.id = object.appId + "-" + object.tag ?? "-1";
        this.lastUpdate = object.lastUpdate ? object.lastUpdate : -1;
        this.passPercent = object.passPercent ? object.passPercent : 100;
        this.shortId = object.shortId ? object.shortId : -1;
        this.stateId = object.stateId ? object.stateId : -1;
        this.tag = object.tag ?? "";
        this.testQuestionData = new Array();
        this.timeTest = object.timeTest ?? -1;
        this.title = object.title ? object.title : "";
        this.totalQuestion = 0;
        if (!!object.testQuestionData) {
            if (typeof object.testQuestionData === "string") {
                let totalQuestion = 0;
                let testQuestionDataJson = JSON.parse(object.testQuestionData);
                testQuestionDataJson?.forEach((el: any) => {
                    this.testQuestionData.push(el);
                    totalQuestion += el.questionIds?.length ?? 0;
                    if (!el.correctQuestion) {
                        el.correctQuestion = [0, 0, 0];
                    }
                });

                this.totalQuestion = totalQuestion;
            } else {
                this.totalQuestion = object.totalQuestion ?? 0;
                this.testQuestionData = new Array();
                object.testQuestionData?.forEach((el: any) => {
                    this.testQuestionData.push(el);
                });
            }
        }
        if (object.questionIds) {
            this.questionIds = object.questionIds;
        } else {
            this.questionIds = new Array();
            this.testQuestionData?.forEach((el) => {
                el.questionIds.forEach((el) => {
                    this.questionIds.push(el);
                });
            });
        }
    }
}

export const getNumQuestion = (questionData: any) => {
    let nbQuestions = 0;
    let nbAllowedMistakes = 0;
    for (let i = 0; i < questionData.length; i++) {
        nbQuestions += questionData[i]["questionIds"]?.length ?? 0;
        nbAllowedMistakes += (questionData[i]["questionIds"]?.length ?? 0) * (1 - questionData[i]["requiredPass"] / 100);
    }
    nbAllowedMistakes = Math.floor(nbAllowedMistakes);
    return { nbQuestions, nbAllowedMistakes };
};

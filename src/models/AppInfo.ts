import { parseBoolean } from "../utils";

export interface IAppInfo {
    appId: number | null; // phải để như này vì hàm getAppInfo viết hơi dở
    appName: string;
    appNameId: string;
    appShortName: string;
    bucket: string;
    categoryId: number;
    description: string;
    descriptionSEO: string;
    // hasState: boolean;
    keywordSEO: string;
    linkAndroid: string;
    linkIos: string;
    rank_math_title?: string;
    // stateId?: number;
    // stateName?: string;
    title: string;
    totalQuestion: number;
    usingMathJax: boolean;
}
export class AppInfo implements IAppInfo {
    appId: number | null;
    appName: string;
    appNameId: string;
    appShortName: string;
    bucket: string;
    categoryId: number;
    description: string;
    descriptionSEO: string;
    hasState: boolean;
    keywordSEO: string;
    linkAndroid: string;
    linkIos: string;
    rank_math_title?: string;
    // stateId?: number;
    // stateName?: string;
    title: string;
    totalQuestion: number;
    usingMathJax: boolean;

    constructor(object: any = {}) {
        this.appId = object.appId ? parseInt(object.appId + "") : null;
        this.appName = object.appName ?? "";
        this.appNameId = object.appNameId ?? "";
        this.appShortName = object.appShortName ?? "";
        this.bucket = object.bucket ?? "";
        this.categoryId = object.categoryId ? parseInt(object.categoryId + "") : 0;
        this.description = object.description ?? "";
        this.descriptionSEO = object.descriptionSEO ?? "";
        this.hasState = parseBoolean(object.hasState) ?? false;
        this.keywordSEO = object.keywordSEO ?? "";
        this.linkAndroid = object.linkAndroid ?? "";
        this.linkIos = object.linkIos ?? "";
        this.rank_math_title = object.rank_math_title ?? "";
        // this.stateId = object.stateId ?? -1;
        // this.stateName = object.stateName ?? "";
        this.title = object.title ?? "";
        this.totalQuestion = object.totalQuestion ?? "";
        this.usingMathJax = parseBoolean(object.usingMathJax);
    }
}

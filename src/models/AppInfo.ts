import { parseBoolean } from "../utils";

export interface IAppInfo {
    appId: number | null; // phải để như này vì hàm getAppInfo viết hơi dở
    appName: string; // tên
    appNameId: string; // biến này đến gen ra đường link từ app cha đến các app con
    appShortName: string; // vai trò của biến này là sử dụng trong đường link tới các phần học
    bucket: string; // folder trên gg cloud
    categoryId: number; // phân loại mục hiển thị tại trang home app cha
    descriptionSEO: string; // seo
    hasState: boolean; //
    keywordSEO: string; // seo
    linkAndroid: string;
    linkIos: string;
    title: string; // seo
    totalQuestion: number; // tổng số lượng câu hỏi (để hiện ở trang home app cha)
    usingMathJax: boolean;
    icon: string;
}
export class AppInfo implements IAppInfo {
    appId: number | null;
    appName: string;
    appNameId: string;
    appShortName: string;
    bucket: string;
    categoryId: number;
    descriptionSEO: string;
    hasState: boolean;
    keywordSEO: string;
    linkAndroid: string;
    linkIos: string;
    title: string;
    totalQuestion: number;
    usingMathJax: boolean;
    icon: string;

    constructor(object: any = {}) {
        this.appId = object.appId ? parseInt(object.appId + "") : null;
        this.appName = object.appName ?? "";
        this.appNameId = object.appNameId ?? "";
        this.appShortName = object.appShortName ?? "";
        this.bucket = object.bucket ?? "";
        this.categoryId = object.categoryId ? parseInt(object.categoryId + "") : 0;
        this.descriptionSEO = object.descriptionSEO ?? "";
        this.hasState = parseBoolean(object.hasState) ?? false;
        this.keywordSEO = object.keywordSEO ?? "";
        this.linkAndroid = object.linkAndroid ?? "";
        this.linkIos = object.linkIos ?? "";
        this.title = object.title ?? "";
        this.totalQuestion = object.totalQuestion ?? "";
        this.usingMathJax = parseBoolean(object.usingMathJax);
        this.icon = object.icon ?? "";
    }
}

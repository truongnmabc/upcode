import { ITestInfo } from "@/models/TestInfo";
import { ITopic } from "@/models/Topic";

export default interface IWebData {
    appId?: number;
    type?: string; // truyền cái này để gọi getStudyData
    slug?: string; //để check lấy dữ liệu
    topicId?: string;
    content?: string; // text seo
    isBranch?: boolean; // is branch page
    isQuestionPage?: boolean; // is question page
    title?: string; // SEO

    topics?: ITopic[]; // truyền cái này để update vào redux
    tests?: ITestInfo[]; // truyền cái này để update vào redux
}

import { ITestInfo } from "@/models/TestInfo";
import { ITopic } from "@/models/Topic";

export default interface IWebData {
    appId?: number;
    type?: string; // truyền cái này để gọi getStudyData
    fullSlug?: string; //để check lấy dữ liệu
    topicId?: string;
    content?: string; // text seo
    isQuestionPage?: boolean; // is question page
    title?: string; // SEO
    gameType?: 0 | 1 | -1;
    bucket?: string;
    topics?: ITopic[]; // truyền cái này để update vào redux
    tests?: ITestInfo[]; // truyền cái này để update vào redux
}

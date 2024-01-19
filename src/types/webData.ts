export default interface IWebData {
    appId: number;
    type: string;
    slug?: string; //để check lấy dữ liệu
    topicId?: string;
    content?: string; // text seo
    isBranch?: boolean; // is branch page
    isQuestionPage?: boolean; // is question page
    title?: string; // SEO
}

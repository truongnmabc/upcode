export interface ITopic {
    id: string; // topic chia level nên trường id chứa cả thành phần level trong này nên tạm thời cứ để như này đã
    parentId: number;
    rootTopicId: number;
    name: string;
    tag: string;
    icon: string;
    topics: ITopic[];
    slug: string;
}
export default class Topic implements ITopic {
    id: string;
    parentId: number;
    rootTopicId: number;
    name: string;
    tag: string;
    icon: string;
    topics: ITopic[];
    slug: string;

    constructor(object?: any) {
        this.id = object.id + "" ?? "-1";
        this.parentId = object.parentId ?? -1;
        this.rootTopicId = object.rootTopicId ?? -1;
        this.name = object.name ?? "";
        this.tag = object.tag ?? "";
        this.icon = object.icon ?? "";
        this.slug = object.slug ?? "/";
        if (this.tag.includes("level")) this.slug = ""; // để nếu xảy ra lỗi thì còn phần biệt được với topic tổng
        this.topics = object.topics?.map((t: any) => new Topic(t)); // để như này cho nếu trường này null thì biết nó là dữ liệu tại local đang là dữ liệu cũ (data cũ không có trường này) thì còn biết đường để xử lý; không được gán mặc định là [] vì có thể có app không có level!!
        try {
            if (this.topics?.length > 1) {
                this.topics.sort((a, b) => {
                    let a_level = parseInt(a.id.split("-")[1]);
                    let b_level = parseInt(b.id.split("-")[1]);
                    return a_level - b_level;
                });
            }
        } catch (e) {
            console.log("sort topic level error", e);
        }
    }
}

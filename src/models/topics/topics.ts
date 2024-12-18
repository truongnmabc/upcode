export interface ITopic {
    id: number;
    parentId: number;
    name: string;
    icon: string;
    tag: string;
    type: number;
    contentType: number;
    orderIndex: number;
    // NOTE: api khong tra ve
    topics?: ITopic[];
    description?: string;
    status?: number;
    slug?: string;
    totalQuestion?: number;

    // Optional
    color?: string;
}
export default class Topic implements ITopic {
    icon: string;
    id: number;
    name: string;
    type: number;
    contentType: number;
    orderIndex: number;
    parentId: number;
    status: number;
    description: string;
    tag: string;
    slug: string;
    totalQuestion: number;
    topics?: ITopic[];

    constructor(object: Partial<ITopic> = {}) {
        this.description = object.description ?? "";
        this.icon = object.icon ?? "";
        this.id = object.id ?? -1;
        this.name = object.name ?? "";
        this.type = object.type ?? 0;
        this.contentType = object.contentType ?? 0;
        this.orderIndex = object.orderIndex ?? 0;
        this.parentId = object.parentId ?? -1;
        this.status = object.status ?? 0;
        this.tag = object.tag ?? "";
        this.slug = `${object.tag}-practice-test`;
        this.totalQuestion = object.totalQuestion ?? 0;
        this.topics = object.topics ?? [];
    }
}

export interface IProgress {
    familiar: number;
    mastered: number;
    notSeen: number;
}

export interface ITopicResState {
    id: string; // topic chia level nên trường id chứa cả thành phần level trong này nên tạm thời cứ để như này đã
    parentId: number;
    rootTopicId: number;
    name: string;
    tag: string;
    icon: string;
    topics: ITopic[];
    slug: string;
    orderIndex: number;
    img?: string;
    totalQuestion?: number;
}

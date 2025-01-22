export interface ISubTopicProgress {
    id: number;
    parentId: number;
    part: IPartProgress[];
    pass: boolean;
    subTopicTag: string;
}

export interface IPartProgress {
    id: number;
    parentId: number;
    status: number;
    totalQuestion: number;
    tag: string;
    turn: number;
}

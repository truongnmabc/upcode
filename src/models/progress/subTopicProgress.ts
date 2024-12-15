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

// export default class SubTopicProgress implements ISubTopicProgress {
//   id: number;
//   parentId: number;
//   part?: IPartProgress[];
//   pass: boolean;
//   subTopicTag: string;
//   constructor(object: Partial<ISubTopicProgress> = {}) {
//     this.id = object.id ?? -1;
//     this.parentId = object.parentId ?? -1;
//     this.part = object.part;
//     this.pass = object.pass ?? false;
//     this.subTopicTag = object.subTopicTag ?? "";
//   }
// }

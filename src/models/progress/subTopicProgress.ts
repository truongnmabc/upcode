import { IPart } from "../topics/part";

export interface ISubTopicProgress {
  id: number;
  parentId: number;
  part?: IPartProgress[];
  pass: boolean;
  subTopicTag: string;
}
export default class SubTopicProgress implements ISubTopicProgress {
  id: number;
  parentId: number;
  part?: IPartProgress[];
  pass: boolean;
  subTopicTag: string;
  constructor(object: Partial<ISubTopicProgress> = {}) {
    this.id = object.id ?? -1;
    this.parentId = object.parentId ?? -1;
    this.part = object.part;
    this.pass = object.pass ?? false;
    this.subTopicTag = object.subTopicTag ?? "";
  }
}

export interface IPartProgress extends IPart {
  // *NOTE: đã pass chưa
  status: number;
}

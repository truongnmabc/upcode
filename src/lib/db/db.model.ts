import Dexie, { Table } from "dexie";

import { ITopic } from "../models/topics/topics";
import { IPart } from "../models/topics/part";
import { ITopicQuestion } from "../models/question/topicQuestion";
import { ITopicStatus } from "../models/question/topicStatus";
import { ISubTopicProgress } from "../models/progress/subTopicProgress";
import { IUserQuestionProgress } from "../models/progress/userQuestionProgress";

export class DB extends Dexie {
  userProgress!: Table<IUserQuestionProgress>;
  subTopicProgress!: Table<ISubTopicProgress>;
  topicQuestion!: Table<ITopicQuestion>;
  topicStatus!: Table<ITopicStatus>;
  topics!: Table<ITopic>;
  part!: Table<IPart>;
  constructor() {
    super("ABC");
    this.version(1).stores({
      // *NOTE: chứa câu trả lời của người dùng.

      userProgress: "++privateId,id,parentId",

      // *NOTE: Chứa tiến trình hiện tại của người dùng,  theo subTopic

      subTopicProgress: "++privateId,id,parentId",

      // *NOTE: Chứa thông tin câu hỏi của part

      topicQuestion: "++id,parentId,[subTopicTag+tag]",

      // *NOTE: Xem mainTopic đã có dữ liệu chưa

      topicStatus: "++id,parentId",

      // *NOTE: chứa thông tin của mainTopic và subTopic

      topics: "++id, slug",

      // *NOTE: chứa thông tin của part: id,name,slug,status,tag,...

      part: "++id, parentId",
    });
  }
}

export const db = new DB();

import Dexie, { Table } from "dexie";

import { ITestQuestion } from "@/models/tests/testQuestions";
import { ISubTopicProgress } from "../models/progress/subTopicProgress";
import { IUserQuestionProgress } from "../models/progress/userQuestionProgress";
import { ITopicQuestion } from "../models/question/topicQuestion";
import { ITopicStatus } from "../models/question/topicStatus";
import { ITest } from "../models/tests/tests";
import { ITopic } from "../models/topics/topics";
import { IUserActions } from "../models/user/useAction";

export class DB extends Dexie {
    userProgress!: Table<IUserQuestionProgress>;
    subTopicProgress!: Table<ISubTopicProgress>;
    topicQuestion!: Table<ITopicQuestion>;
    topicStatus!: Table<ITopicStatus>;
    topics!: Table<ITopic>;
    testQuestions!: Table<ITestQuestion>;
    useActions!: Table<IUserActions>;
    tests!: Table<ITest>;
    constructor() {
        super("abc-elearning");
        this.version(1).stores({
            // *NOTE: chứa câu trả lời của người dùng.

            userProgress: "++id,parentId,type",

            // *NOTE: Chứa tiến trình hiện tại của người dùng,  theo subTopic

            subTopicProgress: "++privateId,id,parentId",

            // *NOTE: Chứa thông tin câu hỏi của part

            topicQuestion: "++id,parentId,[subTopicTag+tag]",

            // *NOTE: Xem mainTopic đã có dữ liệu chưa

            topicStatus: "++id",

            // *NOTE: chứa thông tin của mainTopic và subTopic

            topics: "++id, slug",

            // *NOTE: chứa thông tin của part: id,name,slug,status,tag,...

            // part: "++id, parentId",
            useActions: "++id,questionId",

            tests: "++id, testType",

            testQuestions: "++id,parentId",
        });
    }
}

export const db = new DB();

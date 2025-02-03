import Dexie, { Table } from "dexie";

import { ITestQuestion } from "@/models/tests/testQuestions";
import { ISubTopicProgress } from "../models/progress/subTopicProgress";
import { IUserQuestionProgress } from "../models/progress/userQuestionProgress";
import { ITopicQuestion } from "../models/question/topicQuestion";
import { ITopicStatus } from "../models/question/topicStatus";
import { ITopic } from "../models/topics/topics";
import { IUserActions } from "../models/user/userReactions";
import { IPassingModel } from "@/models/passing/passingModel";
import { IPaymentInfos } from "@/models/payment/payment";
import { IQuestion } from "@/models/question/questions";

export class DB extends Dexie {
    userProgress!: Table<IUserQuestionProgress>;
    subTopicProgress!: Table<ISubTopicProgress>;
    topicQuestion!: Table<ITopicQuestion>;
    topicStatus!: Table<ITopicStatus>;
    topics!: Table<ITopic>;
    testQuestions!: Table<ITestQuestion>;
    useActions!: Table<IUserActions>;
    passing!: Table<IPassingModel>;
    paymentInfos!: Table<IPaymentInfos>;
    questions!: Table<IQuestion>;

    constructor(appName: string) {
        super(appName);

        this.version(1).stores({
            // *NOTE: chứa câu trả lời của người dùng.

            userProgress: "++id,parentId,gameMode",

            // *NOTE: Chứa tiến trình hiện tại của người dùng,  theo subTopic

            subTopicProgress: "++privateId,id,parentId",

            // *NOTE: Chứa thông tin câu hỏi của part

            topicQuestion: "++id,parentId,[subTopicTag+tag]",

            // *NOTE: Xem mainTopic đã có dữ liệu chưa

            topicStatus: "++id",

            // *NOTE: chứa thông tin của mainTopic và subTopic

            topics: "++id, slug",

            // *NOTE: chứa thông tin của part: id,name,slug,status,tag,...

            useActions: "++id,partId,questionId",

            testQuestions: "++id,parentId,gameMode",

            passing: "++id,parentId",

            paymentInfos: "++id,userId",

            questions: "++id,parentId",
        });
    }
}

export let db: DB | null = null;

export const initializeDB = (appShortName: string): DB => {
    if (!db) {
        db = new DB(appShortName);
    }
    return db;
};

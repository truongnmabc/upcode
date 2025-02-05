import Dexie, { Table } from "dexie";

import { IPaymentInfos } from "@/models/payment/payment";
import { ITestQuestion } from "@/models/tests/testQuestions";
import { ITopicProgress } from "@/models/topics/topicsProgress";
import { IUserQuestionProgress } from "../models/progress/userQuestionProgress";
import { ITopicQuestion } from "../models/question/topicQuestion";
import { IUserActions } from "../models/user/userReactions";
import { IPassingModel } from "@/models/passing/passingModel";

export class DB extends Dexie {
    userProgress!: Table<IUserQuestionProgress>;

    testQuestions!: Table<ITestQuestion>;

    paymentInfos!: Table<IPaymentInfos>;

    questions!: Table<ITopicQuestion>;

    topics!: Table<ITopicProgress>;

    useActions!: Table<IUserActions>;

    passingApp!: Table<IPassingModel>;

    constructor(appName: string) {
        super(appName);

        this.version(1).stores({
            userProgress: "++id,parentId",

            testQuestions: "++id,gameMode",

            paymentInfos: "++id,userId",

            //  Chứa thông tin câu hỏi của app
            questions: "++id,partId,testId,subTopicId",

            //  chứa thông tin của mainTopic và subTopic
            topics: "++id,slug",

            // lưu thông tin bookmark, like của người dùng
            useActions: "++id,partId,questionId",

            passingApp: "++id",
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

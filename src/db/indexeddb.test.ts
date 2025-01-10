import "fake-indexeddb/auto";
import Dexie from "dexie";

describe("IndexedDB Initialization", () => {
    const db = new Dexie("asvab");

    beforeAll(() => {
        // Define schema
        db.version(1).stores({
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

            useActions: "++id,partId,questionId",

            testQuestions: "++id,parentId,type",

            passing: "++id,parentId",

            paymentInfos: "++id,userId",
        });
    });

    afterAll(async () => {
        // Cleanup database
        await db.delete();
    });

    it("should initialize IndexedDB successfully", async () => {
        // Open the database
        await db.open();

        // Check if database name matches
        expect(db.name).toBe("asvab");

        // Check if object store exists
        const storeNames = db.tables.map((table) => table.name);
        expect(storeNames).toContain("topics");

        // Close the database
        db.close();
    });

    it("should throw an error if accessing a non-existent store", async () => {
        // Attempt to access a non-existent store
        const invalidTransaction = async () => {
            const nonExistentStore = db.table("nonExistentStore");
            await nonExistentStore.get(1);
        };

        await expect(invalidTransaction()).rejects.toThrow(
            "Table nonExistentStore does not exist"
        );
    });
});

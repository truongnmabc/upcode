import { db } from "@/db/db.mock";
import "core-js/stable/structured-clone";
describe("IndexedDB Initialization", () => {
    it("should initialize IndexedDB successfully", async () => {
        // Kiểm tra tên cơ sở dữ liệu
        expect(db.name).toBe("testDB");
        // Kiểm tra nếu object store tồn tại
        const storeNames = db.tables.map((table) => table.name);
        expect(storeNames).toContain("topics");
        expect(storeNames).toContain("testQuestions");
    });

    it("should throw an error if accessing a non-existent store", async () => {
        // Thử truy cập một object store không tồn tại
        const invalidTransaction = async () => {
            const nonExistentStore = db.table("nonExistentStore");
            await nonExistentStore.get(1);
        };

        // Xác nhận rằng lỗi được ném ra
        await expect(invalidTransaction()).rejects.toThrow(
            "Table nonExistentStore does not exist"
        );
    });

    it("should allow adding and retrieving data from a valid store", async () => {
        // Thêm dữ liệu vào object store "topics"
        const topic = {
            id: 4596897775878144,
            parentId: 5666897542512640,
            name: "Machines Extended 3",
            icon: "",
            tag: "machines-extended-3",
            type: 3,
            contentType: 1,
            orderIndex: 5,
            topics: [],
            slug: `machines-extended-3-practice-test`,
        };

        await db.topics.add(topic);
        // // Lấy lại dữ liệu từ object store "topics"
        const retrievedTopic = await db.topics
            .where("id")
            .equals(4596897775878144)
            .first();
        expect(retrievedTopic).toEqual(topic);
    });

    it("should return undefined for non-existent data in a valid store", async () => {
        // Cố gắng lấy dữ liệu không tồn tại từ object store "topics"
        const retrievedTopic = await db.table("topics").get(999);
        expect(retrievedTopic).toBeUndefined();
    });
});

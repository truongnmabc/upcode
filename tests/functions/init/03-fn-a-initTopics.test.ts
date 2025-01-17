import { db } from "@/db/db.mock";
import "core-js/stable/structured-clone";
describe("Test Init Data Topics", () => {
    beforeAll(async () => {
        // Đảm bảo cơ sở dữ liệu đã được khởi tạo
        const topicsTable = db.topics;
        const topics = await topicsTable.toArray();

        // Nếu bảng chưa có dữ liệu, thêm dữ liệu mẫu
        if (topics.length === 0) {
            const initialTopics = [
                {
                    id: 1,
                    parentId: 0,
                    name: "Math",
                    icon: "icon_math",
                    tag: "math",
                    type: 1,
                    contentType: 1,
                    orderIndex: 1,
                    slug: "Math",
                    topics: [],
                },
                {
                    id: 2,
                    parentId: 0,
                    name: "Science",
                    icon: "icon_science",
                    tag: "science",
                    type: 1,
                    contentType: 1,
                    orderIndex: 2,
                    slug: "Math",
                    topics: [],
                },
            ];
            for (const topic of initialTopics) {
                await topicsTable.add(topic);
            }
        }
    });

    afterAll(async () => {
        await db.topics.clear();
    });

    it("Should verify initial data exists in IndexedDB", async () => {
        // Kiểm tra dữ liệu ban đầu tồn tại
        const topics = await db.table("topics").toArray();
        expect(topics.length).toBeGreaterThan(0);
    });

    it("Should fake API call to fetch and add topics to IndexedDB", async () => {
        // Giả lập gọi API để lấy thêm dữ liệu
        const fakeApiCall = async () => {
            return [
                {
                    id: 3,
                    parentId: 0,
                    name: "History",
                    icon: "icon_history",
                    tag: "history",
                    type: 1,
                    contentType: 1,
                    orderIndex: 3,
                },
            ];
        };

        const fetchedTopics = await fakeApiCall();
        const topicsTable = db.table("topics");

        // Thêm dữ liệu từ API giả lập vào IndexedDB nếu chưa tồn tại
        for (const topic of fetchedTopics) {
            const exists = await topicsTable.get(topic.id);
            if (!exists) {
                await topicsTable.add(topic);
            }
        }

        const topics = await topicsTable.toArray();
        expect(topics.length).toBeGreaterThan(2); // Số lượng topics phải tăng sau khi thêm
    });

    it("Should retrieve specific topic from IndexedDB", async () => {
        // Lấy một topic cụ thể từ bảng "topics"
        const topic = await db.table("topics").get(1);
        expect(topic).toEqual({
            id: 1,
            parentId: 0,
            name: "Math",
            icon: "icon_math",
            tag: "math",
            type: 1,
            contentType: 1,
            orderIndex: 1,
            slug: "Math",
            topics: [],
        });
    });

    it("Should return undefined for non-existent topic", async () => {
        // Lấy topic không tồn tại
        const topic = await db.table("topics").get(999);
        expect(topic).toBeUndefined();
    });
});

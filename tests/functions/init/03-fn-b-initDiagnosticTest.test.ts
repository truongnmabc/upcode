import "core-js/stable/structured-clone";
import { db as MockDb } from "@/db/db.mock";
import {
    getQuestionsBySubtopic,
    getRandomQuestion,
    setDataStoreDiagnostic,
    createNewDiagnosticTest,
    getExistingDiagnosticTest,
} from "@/redux/repository/game/initData/initDiagnosticTest";
import topicsData from "../../data/listTopic.json";
import testQuestions from "../../data/topicsQuestion.json";

jest.mock("../../../src/db/db.model", () => ({
    db: MockDb,
}));

describe("Test Init Data Diagnostic Test", () => {
    beforeAll(async () => {
        await MockDb.table("topics").bulkAdd(topicsData);
        await MockDb.table("topicQuestion").bulkAdd(testQuestions);
    });

    afterEach(async () => {
        await MockDb.table("testQuestions").clear();
    });

    /** Kiểm tra lấy danh sách topics */
    it("Should fetch all topics from IndexedDB", async () => {
        const topics = await MockDb?.topics.toArray();
        expect(topics.length).toBeGreaterThan(0);
    });

    /** Kiểm tra lấy danh sách câu hỏi theo subtopic */
    it("Should fetch questions by subtopic ID", async () => {
        const subtopicId = topicsData[0]?.topics[0]?.id;
        const questions = await getQuestionsBySubtopic(subtopicId);
        expect(Array.isArray(questions)).toBe(true);
        expect(questions.length).toBeGreaterThan(0);
    });

    /** Kiểm tra chọn câu hỏi ngẫu nhiên */
    it("Should select a random priority question", async () => {
        const subtopicId = topicsData[0]?.topics[0]?.id;
        const questions = await getQuestionsBySubtopic(subtopicId);

        const randomQuestion = getRandomQuestion(questions);

        expect(randomQuestion.level).toBeDefined();
    });

    /** Kiểm tra lưu bài kiểm tra vào IndexedDB */
    it("Should store diagnostic test in IndexedDB", async () => {
        const subtopicId = topicsData[0]?.topics[0]?.id;
        const questions = await getQuestionsBySubtopic(subtopicId);

        await setDataStoreDiagnostic({
            listQuestion: questions,
            parentId: subtopicId,
        });

        const storedTest = await MockDb.testQuestions
            .where("parentId")
            .equals(subtopicId)
            .first();
        expect(storedTest).toBeDefined();
        expect(storedTest?.question.length).toBe(questions.length);
    });

    /** Kiểm tra tạo bài kiểm tra mới */
    it("Should create a new diagnostic test", async () => {
        const test = await createNewDiagnosticTest();
        expect(test.listQuestion.length).toBeGreaterThan(0);
        expect(test.isGamePaused).toBe(false);
    });

    /** Kiểm tra trường hợp không có dữ liệu */
    it("No existing diagnostic test in IndexedDB", async () => {
        const data = await MockDb.testQuestions
            .where("type")
            .equals("diagnosticTest")
            .filter((item) => item.status === 0)
            .first();

        expect(data).toBeUndefined();
    });

    /** Kiểm tra toàn bộ hàm initDiagnosticTestQuestionThunk có trả về kết quả mong muốn không  */
    /**
     *
     * Mỗi sup topic 1 câu, tổng 34 câu
     *
     * **/
    it("Should initialize diagnostic test with data from topics.json", async () => {
        const diagnostic = await MockDb?.testQuestions
            .where("type")
            .equals("diagnosticTest")
            .filter((item) => item.status === 0)
            .first();

        const result = diagnostic
            ? await getExistingDiagnosticTest(diagnostic)
            : await createNewDiagnosticTest();
        if (result) {
            expect(result).toBeDefined();
            expect(result.listQuestion.length).toBeGreaterThan(0);

            //  Lấy tất cả các subtopics từ topics.json
            const allSubtopics = topicsData.flatMap((topic) => topic.topics);
            const totalSubtopics = allSubtopics.length;

            //  Kiểm tra xem số lượng câu hỏi có khớp với số lượng subtopics không
            expect(result.listQuestion.length).toBe(totalSubtopics);

            //  Kiểm tra xem mỗi câu hỏi có thuộc về một subtopic khác nhau không
            const uniqueSubtopics = new Set(
                result.listQuestion.map((q) => q.id)
            );

            expect(uniqueSubtopics.size).toBe(totalSubtopics);
        }
    });
});

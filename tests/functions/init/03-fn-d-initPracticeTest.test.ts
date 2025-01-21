import { db as MockDb } from "@/db/db.mock";
import { ICurrentGame } from "@/models/game/game";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import initPracticeThunk, {
    getLocalUserProgress,
    mapQuestionsWithProgress,
} from "@/redux/repository/game/initData/initPracticeTest";
import { RootState } from "@/redux/store";
import "core-js/stable/structured-clone";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";

const middlewares = [thunk as any];
const mockStore = configureStore(middlewares);

// Mock API request
jest.mock("../../../src/services/request", () => ({
    requestGetData: jest.fn(),
}));

// Giả lập dữ liệu trong database
jest.mock("../../../src/db/db.model", () => ({
    db: MockDb,
}));

describe("Test Init Data Practice Test", () => {
    beforeEach(async () => {
        await MockDb.testQuestions.clear();
    });
    beforeAll(async () => {
        await MockDb.table("userProgress").bulkAdd([
            { parentId: 123, type: "test", selectedAnswers: [{ turn: 1 }] },
            { parentId: 456, type: "test", selectedAnswers: [{ turn: 2 }] },
        ]);
    });

    it("should return user progress if exists", async () => {
        const progress = await getLocalUserProgress(123, "test", 1);

        expect(progress).toBeDefined();
        expect(progress?.length).toBeGreaterThan(0);
    });

    it("should return null if no progress found", async () => {
        const progress = await getLocalUserProgress(999, "test", 1);
        expect(progress?.length).toBe(0);
    });
    it("should map user progress to questions", () => {
        const questions = [
            { id: 1, text: "Q1" },
            { id: 2, text: "Q2" },
        ] as ICurrentGame[];
        const progressData = [
            { id: 1, selectedAnswers: [{ correct: true }] },
        ] as IUserQuestionProgress[];

        const result = mapQuestionsWithProgress(questions, progressData);

        expect(result[0].localStatus).toBe("correct");
        expect(result[1].localStatus).toBe("new");
    });

    it("should mark unanswered questions as new", () => {
        const questions = [{ id: 1, text: "Q1" }] as ICurrentGame[];
        const progressData = [] as IUserQuestionProgress[];

        const result = mapQuestionsWithProgress(questions, progressData);

        expect(result[0].localStatus).toBe("new");
    });

    it("should fetch questions from DB if available", async () => {
        await MockDb.table("testQuestions").add({
            parentId: 123,
            question: [{ id: 1, text: "Question 1", status: 0 }],
            duration: 60,
            isPaused: false,
            elapsedTime: 0,
            remainTime: 3600,
            type: "practiceTests",
            turn: 1,
        });

        const store = mockStore({
            gameReducer: {
                listQuestion: [{ id: 1, text: "Existing Question" }],
                idTopic: -1,
                turn: 3,
            },
        } as RootState);

        const result = await store.dispatch<any>(
            initPracticeThunk({ testId: 123 })
        );

        expect(result.payload.questions.length).toBe(1);
        expect(result.payload.idTopic).toBe(123);
    });
});

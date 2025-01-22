import { db as MockDb } from "@/db/db.mock";
import { ICurrentGame } from "@/models/game/game";
import { RootState } from "@/redux/store";
import { requestGetData } from "@/services/request";
import "core-js/stable/structured-clone";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import initFinalTestThunk from "../../../src/redux/repository/game/initData/initFinalTest";

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

describe("Test Init Data Final Test", () => {
    it("should fetch questions from database if available", async () => {
        // Giả lập dữ liệu trong database
        await MockDb.table("testQuestions").bulkAdd([
            {
                type: "finalTests",
                parentId: 12345,
                turn: 1,
                duration: 120,
                isPaused: false,
                remainTime: 120 * 60,
                question: [
                    { id: 1, text: "Question 1" },
                    { id: 2, text: "Question 2" },
                ] as ICurrentGame[],
            },
        ]);

        const store = mockStore({
            gameReducer: {
                listQuestion: [{ id: 1, text: "Existing Question" }],
                idTopic: -1,
                turn: 3,
            },
        } as RootState);

        const result = await store.dispatch(initFinalTestThunk() as any);

        expect(result.payload.questions.length).toBe(2);
        expect(result.payload.idTopic).toBe(12345);
        expect(result.payload.type).toBe("test");
        expect(result.payload.duration).toBe(120);
        expect(result.payload.isPaused).toBe(false);
        expect(result.payload.remainTime).toBe(120 * 60);
    });

    it("should fetch questions from API if database is empty", async () => {
        await MockDb.table("testQuestions").clear();

        // Giả lập API trả về dữ liệu
        (requestGetData as jest.Mock).mockResolvedValue([
            { id: 1, text: "API Question 1" },
            { id: 2, text: "API Question 2" },
        ]);

        const store = mockStore({
            gameReducer: {
                listQuestion: [{ id: 1, text: "Existing Question" }],
                idTopic: -1,
                turn: 3,
            },
        } as RootState);
        const result = await store.dispatch<any>(initFinalTestThunk());

        expect(requestGetData).toHaveBeenCalledWith({
            url: `asvab/web-data/exam-4886547081986048.json`,
            config: {
                baseURL:
                    "https://storage.googleapis.com/micro-enigma-235001.appspot.com/",
            },
        });

        expect(result.payload.questions.length).toBe(2);
        expect(result.payload.idTopic).toBe(4886547081986048);
        expect(result.payload.type).toBe("test");
        expect(result.payload.duration).toBe(150);
        expect(result.payload.isPaused).toBe(false);
        expect(result.payload.remainTime).toBe(150 * 60);
    });

    it("should update database to mark isPaused as false", async () => {
        await MockDb.table("testQuestions").bulkAdd([
            {
                type: "finalTests",
                parentId: 12345,
                turn: 1,
                duration: 120,
                isPaused: true,
                remainTime: 120 * 60,
                question: [{ id: 1, text: "Question 1" }] as ICurrentGame[],
            },
        ]);

        const store = mockStore({
            gameReducer: {
                listQuestion: [{ id: 1, text: "Existing Question" }],
                idTopic: -1,
                turn: 3,
            },
        } as RootState);
        await store.dispatch(initFinalTestThunk() as any);

        const updatedData = await MockDb.table("testQuestions")
            .where("gameMode")
            .equals("finalTests")
            .first();

        expect(updatedData?.isPaused).toBe(true);
    });
});

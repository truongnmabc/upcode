import "core-js/stable/structured-clone"; // Hỗ trợ clone dữ liệu phức tạp
import { db as MockDb } from "@/db/db.mock"; // Giả lập database
import tryAgainDiagnosticThunk from "../../../src/redux/repository/game/tryAgain/tryAgainDiagnostic";
import { RootState } from "@/redux/store";
import testsMock from "../../data/testQuestion.json";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { ICurrentGame } from "@/models/game/game";
import { AnyAction } from "@reduxjs/toolkit";
import { ThunkDispatch } from "redux-thunk";
type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

const middleware = [thunk] as any;

const mockStore = configureStore<RootState, AppDispatch>(middleware);

// Giả lập dữ liệu mock
jest.mock("../../../src/db/db.model", () => ({
    db: MockDb,
}));

describe("Test tryAgainDiagnosticThunk", () => {
    beforeAll(async () => {
        await MockDb.table("testQuestions").bulkAdd(testsMock);
    });

    it("should fetch questions from store if available", async () => {
        const store = mockStore({
            gameReducer: {
                listQuestion: [{ id: 1, text: "Existing Question" }],
                idTopic: -1,
                turn: 3,
            },
        } as RootState);

        const result = await store.dispatch<any>(
            tryAgainDiagnosticThunk({ testId: 123 })
        );

        expect(result.payload.listQuestion).toEqual([
            {
                id: 1,
                text: "Existing Question",
                localStatus: "new",
                selectedAnswer: null,
            },
        ]);
        expect(result.payload?.turn).toBe(3);
    });

    it("should fetch questions from database if store is empty", async () => {
        const store = await mockStore({
            gameReducer: {
                listQuestion: [] as ICurrentGame[],
                idTopic: -5807971,
                turn: 1,
            },
        } as RootState);

        const result = await store.dispatch<any>(
            tryAgainDiagnosticThunk({ testId: 123 })
        );

        expect(result.payload?.listQuestion.length).toBe(34);
        expect(result.payload?.turn).toBe(1);
    });

    it("should handle case when no questions found", async () => {
        const store = mockStore({
            gameReducer: {
                listQuestion: [] as ICurrentGame[],
                idTopic: -1,
                turn: 1,
            },
        } as RootState);

        const result = await store.dispatch<any>(
            tryAgainDiagnosticThunk({ testId: -2 })
        );

        expect(result.payload.listQuestion).toEqual([]);
        expect(result.payload.turn).toBe(1);
    });
});

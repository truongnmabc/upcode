"use client";

import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { IQuestion } from "@/models/question/questions";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initCustomTestThunk = createAsyncThunk(
    "initCustomTestThunk",
    async () => {
        const diagnostic = await db?.testQuestions
            .where("type")
            .equals("customTets")
            .toArray();

        if (diagnostic && diagnostic?.length > 0) {
            console.log("🚀 ~ diagnostic:", diagnostic);
            const currentTest = diagnostic.find((item) => item.status === 0);
            if (currentTest) return currentTest;
        }
        return null;
    }
);

export default initCustomTestThunk;

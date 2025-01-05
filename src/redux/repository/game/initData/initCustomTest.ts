"use client";

import { db } from "@/db/db.model";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initCustomTestThunk = createAsyncThunk(
    "initCustomTestThunk",
    async () => {
        const list = await db?.testQuestions
            .where("type")
            .equals("customTets")
            .toArray();
        console.log("🚀 ~ list:", list);

        if (list && list?.length > 0) {
            const currentTest = list.find((item) => item.status === 0);
            console.log("🚀 ~ currentTest:", currentTest);
            if (currentTest) return currentTest;
            return null;
        }
        return null;
    }
);

export default initCustomTestThunk;

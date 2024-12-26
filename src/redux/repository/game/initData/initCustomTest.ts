"use client";

import { db } from "@/db/db.model";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initCustomTestThunk = createAsyncThunk(
    "initCustomTestThunk",
    async () => {
        const diagnostic = await db?.testQuestions
            .where("type")
            .equals("customTets")
            .toArray();

        if (diagnostic && diagnostic?.length > 0) {
            const currentTest = diagnostic.find((item) => item.status === 0);
            if (currentTest) return currentTest;
        }
        return null;
    }
);

export default initCustomTestThunk;

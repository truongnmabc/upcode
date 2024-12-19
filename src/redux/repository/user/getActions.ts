import { db } from "@/db/db.model";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface IUserActions {
    partId: number;
}

const getListActionThunk = createAsyncThunk(
    "getListActionThunk",
    async ({ partId }: IUserActions) => {
        const existingAction = await db?.useActions
            .where("partId")
            .equals(partId)
            .toArray();

        console.log("🚀 ~ existingAction:", existingAction);

        return { list: existingAction || [] };
    }
);

export default getListActionThunk;

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AppInfo, IAppInfo } from "@/models/app/appInfo";

export interface IAppInfoReducer {
    appInfo: IAppInfo;
}

const initApp = new AppInfo();
const initialState: IAppInfoReducer = {
    appInfo: initApp,
};
export const appInfoSlice = createSlice({
    name: "appInfo",
    initialState,
    reducers: {
        setAppInfo: (state, action: PayloadAction<IAppInfo>) => {
            state.appInfo = { ...action.payload };
        },
    },
});

export const appInfoReducer = appInfoSlice.reducer;
export const { setAppInfo } = appInfoSlice.actions;
export const appInfoState = (state: RootState) => state.appInfoReducer;

import { AppInfo, IAppInfo } from "../../models/AppInfo";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

export interface IAppInfoReducer {
    loading: boolean;
    appInfo: IAppInfo;
    error: any;
    appInfos: IAppInfo[];
}

export const appInfoSlice = createSlice({
    name: "appInfo",
    initialState: {
        loading: false,
        appInfos: [],
        appInfo: new AppInfo(),
        error: null,
    },
    reducers: {
        setAppInfo: (state, action: PayloadAction<IAppInfo>) => {
            if (action.payload) {
                let appInfo = action.payload;
                state.appInfo = new AppInfo(appInfo);
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(REHYDRATE, (state, action) => {
            if (action["payload"]) {
                let appInfo = action["payload"]["appInfoReducer"]["appInfo"];
                state.appInfo = new AppInfo(appInfo);
            }
        });
    },
});

export default appInfoSlice.reducer;
export const { setAppInfo } = appInfoSlice.actions;

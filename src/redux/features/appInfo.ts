import { AppInfo, IAppInfo } from "../../models/AppInfo";
import { PayloadAction, createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

export interface IAppInfoReducer {
    loading: boolean;
    appInfo: IAppInfo;
    error: any;
    appInfos: IAppInfo[];
}

// const setAppInfo = createAction<IAppInfo>("appInfo/setAppInfo");

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
            return state;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(REHYDRATE, (state, action) => {
            if (action["payload"]) {
                let appInfo = action["payload"]["appInfoReducer"]["appInfo"];
                state.appInfo = new AppInfo(appInfo);
            }
            return state;
        });
    },
});

export default appInfoSlice.reducer;
export const { setAppInfo } = appInfoSlice.actions;

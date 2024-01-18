import { AppInfo, IAppInfo } from "../../models/AppInfo";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

export interface IAppInfoReducer {
    loading: boolean;
    appInfo: IAppInfo;
    error: any;
    appInfos: IAppInfo[];
}

export const rehydrate = createAsyncThunk(REHYDRATE, async (data) => {
    console.log(data);
    return data;
});
export const appInfoReducer = createSlice({
    name: "appInfo",
    initialState: {
        loading: false,
        appInfos: [],
        appInfo: new AppInfo(),
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(rehydrate.fulfilled, (state, action) => {
            console.log("kkk");
            // if (action.payload) {
            //     let appInfo = action.payload["appInfoReducer"]["appInfo"];
            //     if (appInfo && !state.appInfo) {
            //         state.appInfo = appInfo;
            //     }
            // }
        });
    },
});

// (state: IAppInfoReducer = initialState, action) => {
//     switch (action.type) {
//         case REHYDRATE: {
// if (action.payload && action.payload["appInfoReducer"]) {
//     let appInfo = action.payload["appInfoReducer"]["appInfo"];
//     if (appInfo && !state.appInfo) {
//         state.appInfo = appInfo;
//     }
// }
//             return Object.assign({}, state);
//         }
//         case Types.SET_APP_INFO: {
//             return { ...state, appInfo: action.appInfo };
//         }
//         default:
//             return state;
//     }
// };

export default appInfoReducer;

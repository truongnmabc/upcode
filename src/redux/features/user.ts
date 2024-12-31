import { IUserActions } from "@/models/user/useAction";
import { IUserInfo } from "@/models/user/userInfo";
import { createSlice } from "@reduxjs/toolkit";
import useActionsThunk from "../repository/user/actions";
import getListActionThunk from "../repository/user/getActions";
import { RootState } from "../store";

export interface IUserReducer {
    userId: string; // userId này có thể được gen ra mà k cần login nên không dùng trường id này để check là login hay chưa
    userInfo: IUserInfo | null;
    mapLastSyncTime: number;
    mapImportedStudyData: any; // trường này đánh dấu việc đã tải dữ liệu phần học về chưa (cần phải đảm bảo nó đồng bộ với dữ liệu phần học) để không tải lại nữa
    lastSyncTime: number;
    loading: boolean;
    reload: boolean; // reload ở HeaderV4
    loadingPayment: boolean; // để check đã load xong dữ liệu mua hàng chưa
    isPro: boolean; // trường này đánh dấu user có đang ở trạng thái pro hay không, cần được đảm bảo update đúng tại thời điểm user đang on page, và PRO LÀ TÍNH THEO APP

    listActions: IUserActions[];
}

const initState: IUserReducer = {
    userId: "",
    userInfo: null,
    mapLastSyncTime: {},
    lastSyncTime: -2,
    mapImportedStudyData: {},
    loading: true,
    reload: false, // reload sau khi login/logout
    inAppPurchasedInfo: [],
    loadingPayment: true,
    isPro: false,
    listActions: [],
};

export const userSlice = createSlice({
    name: "user",
    initialState: { ...initState },
    reducers: {
        logout: (state) => {
            state.userId = "";
            state.userInfo = null;

            state.mapImportedStudyData = {};
            state.lastSyncTime = -2;
            state.loading = true;
            state.reload = false; // reload sau khi login/logout
            state.loadingPayment = true;
            state.isPro = false;

            setTimeout(() => {
                location.reload();
            }, 200);
        },

        loginSuccess: (state, action) => {
            state.userInfo = action.payload;
            state.reload = true;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(useActionsThunk.fulfilled, (state, action) => {
            const { questionId, status, partId } = action.payload;

            const existingActionIndex = state.listActions.findIndex(
                (item) => item.questionId === questionId
            );

            if (existingActionIndex !== -1) {
                const existingAction = state.listActions[existingActionIndex];
                state.listActions[existingActionIndex] = {
                    ...existingAction,
                    actions: Array.isArray(status) ? status : [],
                };
            } else {
                state.listActions.push({
                    questionId,
                    actions: Array.isArray(status) ? status : [],
                    userId: parseInt(state.userId) || -1,
                    partId,
                });
            }
        });
        builder.addCase(getListActionThunk.fulfilled, (state, action) => {
            const { list } = action.payload;
            state.listActions = list;
        });
    },
});

const { actions, reducer: userReducer } = userSlice;

export const { logout, loginSuccess } = actions;

export const userState = (state: RootState) => state.userReducer;

export default userReducer;

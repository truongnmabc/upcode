import { IPaymentInfo, InAppSubscription } from "@/models/PaymentInfo";
import { IUserInfo, UserInfo } from "@/models/UserInfo";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import { getUserDeviceLogin } from "../reporsitory/syncData.repository";
import checkPro from "@/utils/checkPro";

export interface IUserReducer {
    userId: string; // userId này có thể được gen ra mà k cần login nên không dùng trường id này để check là login hay chưa
    userInfo: IUserInfo;
    paymentInfo: IPaymentInfo; // thông tin mua hàng của app đang được xét, được tải về khi vào trang
    paymentInfos: IPaymentInfo[]; // thông tin mua hàng của toàn bộ app
    mapLastSyncTime: any;
    lastSyncTime: number;
    mapImportedStudyData: any; // trường này đánh dấu việc đã tải dữ liệu phần học về chưa (cần phải đảm bảo nó đồng bộ với dữ liệu phần học) để không tải lại nữa
    loading: boolean;
    reload: boolean; // reload ở HeaderV4
    inAppPruchasedInfo: InAppSubscription[]; // 1 app có thể mua nhiều gói (giống với nhiều orderId trên web)
    loadingPayment: boolean; // để check đã load xong dữ liệu mua hàng chưa
    isPro: boolean; // trường này đánh dấu user có đang ở trạng thái pro hay không, cần được đảm bảo update đúng tại thời điểm user đang on page, và PRO LÀ TÍNH THEO APP
}

const initState: IUserReducer = {
    userId: null,
    userInfo: null,
    paymentInfo: null,
    paymentInfos: [],
    mapLastSyncTime: {},
    lastSyncTime: -2,
    mapImportedStudyData: {},
    loading: true,
    reload: false, // reload sau khi login/logout
    inAppPruchasedInfo: [],
    loadingPayment: true,
    isPro: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState: { ...initState },
    reducers: {
        logout: (state) => {
            state.userId = null;
            state.userInfo = null;
            state.paymentInfo = null;
            state.paymentInfos = [];
            state.mapLastSyncTime = {};
            state.lastSyncTime = -2;
            state.mapImportedStudyData = {};
            state.loading = true;
            state.reload = false; // reload sau khi login/logout
            state.inAppPruchasedInfo = [];
            state.loadingPayment = true;
            state.isPro = false;

            setTimeout(() => {
                location.reload();
            }, 200);
        },

        loginSuccess: (state, action) => {
            let payload = action.payload;
            console.log(payload);

            if (payload) {
                state.userInfo = payload.userInfo;
                state.reload = true;
            }
        },
        paymentSuccessAction: (state, action: PayloadAction<IPaymentInfo>) => {
            state.paymentInfo = action.payload ?? null;
            if (action.payload) {
                let index = state.paymentInfos.findIndex((paymentInfo) => paymentInfo.appId == action.payload.appId);
                if (index >= 0) {
                    state.paymentInfos[index] = action.payload;
                } else {
                    state.paymentInfos.push(action.payload);
                }
            }
        },
    },
    extraReducers: (builder) => {
        //TODO
        builder.addCase(REHYDRATE, (state, action) => {
            if (action["payload"]) {
                let userIdExit = null;
                if (action["payload"]["userReducer"]) {
                    state = action["payload"]["userReducer"];
                    userIdExit = state["userId"];
                    if (!userIdExit) {
                        userIdExit = genUserId();
                        state.userId = userIdExit; // trường hợp chưa login ??, hoặc chẳng may mất mát dữ liệu ??
                    }
                    if (state.userInfo) {
                        state.userInfo.id = state.userInfo.id.toLowerCase();
                        state.userInfo.email = state.userInfo.email.toLowerCase();
                        state.userInfo = new UserInfo(state.userInfo);
                    }
                    if (!state.paymentInfos) {
                        state.paymentInfos = [];
                        state.paymentInfo = null; // cân nhắc REHYDATE sẽ không lấy lại trường này, mà ở StoreProvider đã gọi api lấy từ datastore về
                    }
                    // state.inAppPruchasedInfo = []
                }
            }
            state.loading = false;
            state.loadingPayment = false;
            state.isPro = false;
            state.reload = false;
        });

        builder.addCase(getUserDeviceLogin.fulfilled, (state, action) => {
            if (action.payload) {
                state.paymentInfo = action.payload.paymentInfo;
                state.paymentInfos = action.payload.paymentInfos;
                state.inAppPruchasedInfo = action.payload.inAppSubs;
                state.isPro = checkPro(state.paymentInfo, state.inAppPruchasedInfo);
                state.loadingPayment = true;
            }
        });
    },
});

const genUserId = () => {
    return Date.now() + "" + Math.floor(Math.random() * 99999);
};

export const { logout, loginSuccess, paymentSuccessAction } = userSlice.actions;
export default userSlice.reducer;

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getUserDeviceLogin } from "../repository/sync/syncData";
import { IUserActions } from "@/models/user/useAction";

import { RootState } from "../store";
import {
    InAppSubscription,
    IPaymentInfos,
} from "@/models/payment/paymentInfos";

export interface IUserReducer {
    paymentInfo: IPaymentInfos | null; // thông tin mua hàng của app đang được xét, được tải về khi vào trang
    paymentInfos: IPaymentInfos[]; // thông tin mua hàng của toàn bộ app
    inAppPurchasedInfo: InAppSubscription[]; // 1 app có thể mua nhiều gói (giống với nhiều orderId trên web)
    isPro: boolean; // trường này đánh dấu user có đang ở trạng thái pro hay không, cần được đảm bảo update đúng tại thời điểm user đang on page, và PRO LÀ TÍNH THEO APP
    listActions: IUserActions[];
    isFetched: boolean;
}

const initState: IUserReducer = {
    paymentInfo: null,
    paymentInfos: [],
    inAppPurchasedInfo: [],
    isPro: false,
    listActions: [],
    isFetched: false,
};

const paymentSlice = createSlice({
    name: "user",
    initialState: { ...initState },
    reducers: {
        paymentSuccessAction: (state, action: PayloadAction<IPaymentInfos>) => {
            state.paymentInfo = action.payload ?? null;
            if (action.payload) {
                let index = state.paymentInfos.findIndex(
                    (paymentInfo) => paymentInfo.appId == action.payload.appId
                );
                if (index >= 0) {
                    state.paymentInfos[index] = action.payload;
                } else {
                    state.paymentInfos.push(action.payload);
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getUserDeviceLogin.fulfilled, (state, action) => {
            state.isFetched = true;
            // if (action.payload) {
            //     const { paymentInfo, paymentInfos, inAppSubs } = action.payload;
            //     if (action.payload) {
            //         // state.paymentInfo = paymentInfo;
            //         // state.paymentInfos = paymentInfos;
            //         // state.inAppPurchasedInfo = inAppSubs;
            //         // if (state.paymentInfo) {
            //         //     state.isPro = checkPro(
            //         //         state.paymentInfo,
            //         //         state.inAppPurchasedInfo
            //         //     );
            //         // }
            //     }
            // }
        });
    },
});

const { actions, reducer: paymentReducer } = paymentSlice;

export const { paymentSuccessAction } = actions;

export const paymentState = (state: RootState) => state.paymentReducer;

export default paymentReducer;

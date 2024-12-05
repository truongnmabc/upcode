import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

import { RootState } from "../store";
import { IUserInfo } from "@/lib/models/user/UserInfo";
import { IPaymentInfo } from "@/lib/models/user/PaymentInfo";

export interface IUserReducer {
  userId: string; // userId này có thể được gen ra mà k cần login nên không dùng trường id này để check là login hay chưa
  userInfo: IUserInfo;
  paymentInfo: IPaymentInfo; // thông tin mua hàng của app đang được xét, được tải về khi vào trang
  paymentInfos: IPaymentInfo[]; // thông tin mua hàng của toàn bộ app
  mapLastSyncTime: any;
  lastSyncTime: number;
  mapImportedStudyData: any; // trường này đánh dấu việc đã tải dữ liệu phần học về chưa (cần phải đảm bảo nó đồng bộ với dữ liệu phần học) để không tải lại nữa
  mapSyncStudyData: { [appKey: string]: number }; // trường này đánh dấu việc đã sync dữ liệu phần học về chưa (key: appKey / value: timestamp: thời gian sync dữ liệu mới nhất)
  loading: boolean; // loading user
  reload: boolean; // reload sau khi logout/ login; khi = true thì gọi hàm reload ở StoreProvider
  redirect: boolean; // redirect sau khi login; khi = true thì gọi hàm redirect ở StoreProvider
  inAppPurchasedInfo: InAppSubscription[]; // 1 app có thể mua nhiều gói (giống với nhiều orderId trên web)
  loadingPayment: boolean; // để check đã load xong dữ liệu mua hàng chưa
  isPro: boolean; // trường này đánh dấu user có đang ở trạng thái pro hay không, cần được đảm bảo update đúng tại thời điểm user đang on page, và PRO LÀ TÍNH THEO APP
}
export interface InAppSubscription {
  id: number;
  appId: number;
  userId: string; // email đăng nhập
  os: string;
  createDate: number;
  purchaseDate: number;
  expriredDate: number; // thời hạn của lần ra hạn hiện tại
  purchased: boolean; // đã thanh toán hay chưa
  trialPeriod: boolean; // trong trial hay không
  in_app: {
    purchase_date: number; //thời gian thanh toán
    expires_date: number; // thời gian hết hạn
    in_app_ownership_type: string; // trạng thái PURCHASED | FAMILY_SHARE...
    is_trial_period: boolean; // đang trial
  }[]; //ds các lần thanh toán của gói này (ở đây không lưu transactionId vì không cần dùng đến)
}

const initState: IUserReducer = {
  userId: null,
  userInfo: null,
  paymentInfo: null,
  paymentInfos: [],
  mapLastSyncTime: {},
  lastSyncTime: -2,
  mapImportedStudyData: {},
  mapSyncStudyData: {},
  loading: true,
  reload: false, // reload sau khi login/logout
  redirect: false,
  inAppPurchasedInfo: [],
  loadingPayment: true,
  isPro: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: { ...initState },
  reducers: {
    paymentSuccessAction: (state, action: PayloadAction<IPaymentInfo>) => {
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
    syncSuccessful: (state, action: PayloadAction<string>) => {
      let lastUpdate = Date.now();
      let appKey = action.payload;
      state.mapSyncStudyData[appKey] = lastUpdate;
    },
    logoutSuccessfull: (state) => {
      state.userId = null;
      state.userInfo = null;
      state.paymentInfo = null;
      state.paymentInfos = [];
      state.mapLastSyncTime = {};
      state.lastSyncTime = -2;
      state.mapImportedStudyData = {};
      state.loading = true;
      state.reload = true; // reload sau khi login/logout
      state.inAppPurchasedInfo = [];
      state.loadingPayment = true;
      state.isPro = false;
      state.mapSyncStudyData = {}; // logout thì reset lại
    },

    loginSuccess: (state, action: PayloadAction<IUserInfo>) => {
      state.userInfo = action.payload;
      state.userId = action.payload.id;

      var url = new URL(window.location.href);
      var callback = url.searchParams.get("callback");

      if (callback) {
        // back lại trang trước đó mà được điều hướng sang login
        state.redirect = true;
      } else {
        state.reload = true;
      }
    },
  },
});

const genUserId = () => {
  return Date.now() + "" + Math.floor(Math.random() * 99999);
};

const { reducer: userReducer, actions } = userSlice;

export const {
  paymentSuccessAction,
  syncSuccessful,
  logoutSuccessfull,
  loginSuccess,
} = actions;

export default userReducer;

export const userState = (state: RootState) => state.userReducer;

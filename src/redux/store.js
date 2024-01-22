import { configureStore } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { enableMapSet } from "immer";
import { persistStore, persistReducer } from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import Config from "@/config";
import createEncryptor from "redux-persist-transform-encrypt";
// import createIdbStorage from "@piotr-cz/redux-persist-idb-storage";
import defaultStorage from "redux-persist/lib/storage";
import rootReducer from "./features/rootReducer";

enableMapSet();
const _isProduction = process.env.NODE_ENV === "production";

const reducers = (state, action) => {
    if (action.type === HYDRATE) {
        if (action.payload.appInfoReducer?.appInfo) {
            state.appInfoReducer.appInfo = action.payload.appInfoReducer.appInfo;
        }
    }
    return rootReducer(state, action);
};

export const makeStore = () => {
    const isClient = typeof window !== "undefined";
    if (!isClient) {
        //https://redux-toolkit.js.org/usage/nextjs
        // với next js, có cả quá trình SSR nên  tại server cũng cần khởi tạo store và về client sẽ khởi tạo lại, để tránh lỗi gì đó, trong link trên có đề cập đến
        const store = configureStore({
            reducer: rootReducer,
            devTools: !_isProduction,
            middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }), // liên quan đến check không đồng bộ cho các action của PERSIST
        });
        return store;
    } else {
        const encryptor = createEncryptor({
            secretKey: Config.SECRET_KEY,
            onError: function (error) {},
        });
        const persistConfig = {
            key: "root",
            storage: defaultStorage,
            stateReconciler: autoMergeLevel2,
            transform: [encryptor],
            whitelist: ["appInfoReducer", "cardReducer", "listGameReducer", "testReducer", "topicReducer", "timeLeftReducer"], // các reducer được tự động load dữ liệu khi vào trang
        };
        const persistedReducer = persistReducer(persistConfig, reducers);
        const store = configureStore({
            reducer: persistedReducer,
            devTools: !_isProduction,
            middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }), // liên quan đến check không đồng bộ cho các action của PERSIST
        });
        store.__persistor = persistStore(store); // gán thêm vào trường này để nó đi cùng biến store thôi
        return store;
    }
};

export const wrapper = createWrapper(makeStore, {
    debug: false,
    serializeState: (state) => JSON.stringify(state),
    deserializeState: (state) => JSON.parse(state),
});

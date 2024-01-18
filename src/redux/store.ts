import { configureStore } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { enableMapSet } from "immer";
import { persistStore, persistReducer } from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import Config from "@/config";
import createEncryptor from "redux-persist-transform-encrypt";
import createIdbStorage from "@piotr-cz/redux-persist-idb-storage";
import defaultStorage from "redux-persist/lib/storage";
import rootReducer from "./features/rootReducer";
import { isProduction } from "@/config/config_web";

enableMapSet();

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
        const store = configureStore({
            reducer: rootReducer,
            devTools: !isProduction(),
            middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
        });
        return store;
    } else {
        const encryptor = createEncryptor({
            secretKey: Config.SECRET_KEY,
            onError: function (error) {},
        });
        const persistConfig = {
            key: "root",
            storage: globalThis.indexedDB
                ? createIdbStorage({
                      name: "abc-elearning",
                      storeName: "reduxpersist",
                  })
                : defaultStorage,
            stateReconciler: autoMergeLevel2,
            transform: [encryptor],
            whitelist: ["appInfoReducer", "cardReducer", "listGameReducer", "testReducer", "topicReducer"],
        };
        const persistedReducer = persistReducer(persistConfig, reducers);
        const store = configureStore({
            reducer: persistedReducer,
            devTools: !isProduction(),
            middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
        });
        return store;
    }
};

export const persistor = persistStore(makeStore());

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"]; // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type RootState = ReturnType<AppStore["getState"]>; // Infer the `RootState` and `AppDispatch` types from the store itself

export const wrapper = createWrapper(makeStore, {
    debug: false,
    serializeState: (state) => JSON.stringify(state),
    deserializeState: (state) => JSON.parse(state),
});

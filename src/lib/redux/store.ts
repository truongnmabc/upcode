import { configureStore } from "@reduxjs/toolkit";
import { appInfoReducer } from "./features/appInfo";
import appConfigReducer from "./features/appConfig";
import studyReducer from "./features/study";
import gameReducer from "./features/game";
import userReducer from "./features/user";

export const makeStore = () => {
  return configureStore({
    reducer: {
      appInfoReducer,
      appConfigReducer,
      studyReducer,
      gameReducer,
      userReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];

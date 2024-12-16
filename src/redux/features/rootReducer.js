import { combineReducers } from "@reduxjs/toolkit";
import appInfoReducer from "./appInfo";
import cardReducer from "./card";
import gameReducer from "./game";
import listGameReducer from "./listGame";
import testReducer from "./test";
import timeLeftReducer from "./timeLeft";
import topicReducer from "./topic";
import userReducer from "./user";

const rootReducer = combineReducers({
    appInfoReducer,
    cardReducer,
    gameReducer,
    listGameReducer,
    testReducer,
    timeLeftReducer,
    topicReducer,
    userReducer,
});
export default rootReducer;

import { combineReducers } from "@reduxjs/toolkit";
import appInfoReducer from "./appInfo";
import cardReducer from "./card";
import gameReducer from "./game";
import listGameReducer from "./listGame";
import testReducer from "./test";
import timeLeftReducer from "./timeLeft";
import topicReducer from "./topic";

const rootReducer = combineReducers({
    appInfoReducer,
    cardReducer,
    gameReducer,
    listGameReducer,
    testReducer,
    timeLeftReducer,
    topicReducer,
});
export default rootReducer;

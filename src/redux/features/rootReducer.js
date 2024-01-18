import { combineReducers } from "@reduxjs/toolkit";
import appInfoReducer from "./appInforReducer";
const rootReducer = combineReducers({ appInfoReducer });
export default rootReducer;

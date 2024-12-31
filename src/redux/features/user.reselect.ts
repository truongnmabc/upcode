import { createSelector } from "reselect";
import { userState } from "./user";

export const selectUserInfo = createSelector(
    [userState],
    (userReducer) => userReducer.userInfo
);

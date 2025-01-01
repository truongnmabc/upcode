import { createSelector } from "reselect";
import { userState } from "./user";

export const selectUserInfo = createSelector(
    [userState],
    (userReducer) => userReducer.userInfo
);

export const selectOpenModalLogin = createSelector(
    [userState],
    (userReducer) => userReducer.shouldOpenLogin
);

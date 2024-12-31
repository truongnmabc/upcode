import { createSelector } from "reselect";
import { paymentState } from "./payment";

export const selectPaymentInfo = createSelector(
    [paymentState],
    (paymentReducer) => paymentReducer.paymentInfo
);

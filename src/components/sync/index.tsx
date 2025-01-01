"use client";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { paymentState, setIsFetched } from "@/redux/features/payment";
import { selectUserInfo } from "@/redux/features/user.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getUserDeviceLogin } from "@/redux/repository/sync/syncData";
import { useEffect } from "react";

const SyncData = () => {
    const appInfos = useAppSelector(selectAppInfo);
    const { isFetched } = useAppSelector(paymentState);
    const userInfo = useAppSelector(selectUserInfo);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (userInfo && userInfo?.id && appInfos && !isFetched) {
            dispatch(setIsFetched(true));
            dispatch(
                getUserDeviceLogin({
                    appInfo: appInfos,
                    email: userInfo?.email,
                })
            );
        }
    }, [userInfo, appInfos, dispatch, isFetched]);
    return null;
};

export default SyncData;

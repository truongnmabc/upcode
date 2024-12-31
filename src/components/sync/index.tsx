"use client";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { paymentState } from "@/redux/features/payment";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getUserDeviceLogin } from "@/redux/repository/sync/syncData";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

const SyncData = () => {
    const appInfos = useAppSelector(selectAppInfo);
    const { isFetched } = useAppSelector(paymentState);
    const { data: userInfos } = useSession();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (userInfos && userInfos.user?.email && appInfos && !isFetched) {
            dispatch(
                getUserDeviceLogin({
                    appInfo: appInfos,
                    email: userInfos.user?.email,
                })
            );
        }
    }, [userInfos?.user, appInfos, dispatch, isFetched]);
    return null;
};

export default SyncData;

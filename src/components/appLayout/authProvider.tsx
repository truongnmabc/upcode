"use client";
import React, { useCallback, useEffect, useLayoutEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    loginHybrid,
    logoutHybrid,
    shouldOpenModalLogin,
} from "@/redux/features/user";
import ModalLogin from "../login";
import {
    selectOpenModalLogin,
    selectUserInfo,
} from "@/redux/features/user.reselect";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ID;

type IUser = {
    id?: string;
    email: string;
    name: string;
    image: string;
};
const AuthProvider = () => {
    const { status, data } = useSession();
    const openModal = useAppSelector(selectOpenModalLogin);
    const userInfo = useAppSelector(selectUserInfo);
    const dispatch = useAppDispatch();
    const [isMount, setIsMount] = React.useState(false);
    const handleClose = useCallback(() => {
        dispatch(shouldOpenModalLogin(false));
    }, [dispatch]);

    const handleCredentialResponse = useCallback(
        async (response: CredentialResponse) => {
            if (response.credential) {
                signIn("token", {
                    redirect: false,
                    token: response.credential,
                });
                handleClose();
            }
        },
        [handleClose]
    );

    const handleLoginInSuccess = async (event: any) => {
        if (event?.detail?.authorization?.id_token) {
            // let decode: any = jwt.decode(event.detail.authorization.id_token, {
            //     verify_signature: false,
            // });
            // if (decode.email) {
            //     if (sendEmail) {
            //         await sendEmail(decode.email);
            //     }
            //     if (submitSuccessFc) {
            //         submitSuccessFc();
            //     }
            //     ga.event({
            //         action: "login_by_apple_success",
            //         params: {
            //             email: decode.email,
            //         },
            //     });
            //     dispatch(
            //         loginSuccess({
            //             userInfo: new UserInfo({
            //                 email: decode.email,
            //                 id: decode.email,
            //             }),
            //         })
            //     );
            //     // dispatch(
            //     //     syncUserDataAction({
            //     //         syncUserData: SYNC_USER_DATA_STATUS.STATUS_SYNCING,
            //     //     })
            //     // );
            // }
        }
    };
    const handleLoginFailed = async (event: any) => {
        try {
            if (event?.detail?.error != "popup_closed_by_user") {
                // await sendErrorToDiscord(event?.detail?.error, "Login Apple Error");
            }
        } catch (error) {
            console.log("error handle");
        }
    };

    useEffect(() => {
        if (
            status === "unauthenticated" &&
            typeof window !== "undefined" &&
            window?.google &&
            !isMount
        ) {
            const timeOut = setTimeout(() => {
                try {
                    window.google?.accounts?.id?.prompt((e) => {
                        console.log("first prompt", e);
                    });
                    setIsMount(true);
                } catch (error) {
                    console.log("🚀 ~ useEffect ~ error", error);
                }
            }, 1000);

            return () => {
                clearTimeout(timeOut);
            };
        }
    }, [status, isMount]);

    const handleCheckUserInfo = useCallback(
        async (user: IUser) => {
            dispatch(loginHybrid(user));
        },
        [dispatch]
    );

    useEffect(() => {
        console.log("🚀 ~ useEffect ~ data:", data?.user);

        if (status === "authenticated" && data && !userInfo.id) {
            if (data.user) handleCheckUserInfo(data.user);
        }

        if (status === "unauthenticated" && !data && userInfo.id) {
            dispatch(logoutHybrid());
        }
    }, [status, data, userInfo, handleCheckUserInfo]);

    useEffect(() => {
        try {
            if (
                typeof window !== "undefined" &&
                window?.google &&
                GOOGLE_CLIENT_ID
            ) {
                window.google?.accounts?.id?.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: (res) => handleCredentialResponse(res),
                    cancel_on_tap_outside: false,
                });
            }
            if (typeof window !== "undefined" && window?.AppleID) {
                window.AppleID?.auth?.init({
                    clientId: process.env.NEXT_PUBLIC_APPLE_ID,
                    scope: "email",
                    redirectURI: window.location.origin,
                    usePopup: true,
                    responseMode: "form_post",
                });
                document.addEventListener(
                    "AppleIDSignInOnSuccess",
                    handleLoginInSuccess
                );
                document.addEventListener(
                    "AppleIDSignInOnFailure",
                    handleLoginFailed
                );
            }
        } catch (error) {
            console.log("🚀 ~ useLayoutEffect ~ error", error);
        }
    }, []);

    return <ModalLogin open={openModal} setOpen={handleClose} />;
};

export default AuthProvider;

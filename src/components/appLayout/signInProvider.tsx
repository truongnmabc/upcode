"use client";
import React, { useEffect, useLayoutEffect } from "react";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ID;
import { signIn, useSession } from "next-auth/react";

const SignInProvider = () => {
    const { status } = useSession();
    async function handleCredentialResponse(response: CredentialResponse) {
        if (response.credential) {
            signIn("token", {
                redirect: false,
                token: response.credential,
            });
        }
    }

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
            window?.google
        ) {
            const timeOut = setTimeout(() => {
                try {
                    window.google?.accounts?.id?.prompt((e) => {
                        console.log("first prompt", e);
                    });
                } catch (error) {
                    console.log("🚀 ~ useEffect ~ error", error);
                }
            }, 1000);

            return () => {
                clearTimeout(timeOut);
            };
        }
    }, [status]);

    useLayoutEffect(() => {
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
    return <></>;
};

export default SignInProvider;

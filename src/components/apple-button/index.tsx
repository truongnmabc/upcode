import AppleIcon from "@mui/icons-material/Apple";
import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { APPLE_CLIENT_ID } from "../../config_app";
import * as ga from "../../services/ga";
import { UserInfo } from "../../models/UserInfo";
import "./index.scss";
import { isProduction } from "@/config/config_web";
import { loginSuccess } from "@/redux/features/user";
const loadScript = (src: string) =>
    new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"] async `)) return resolve(() => {});
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve(() => {});
        script.onerror = (err) => reject(err);
        document.body.appendChild(script);
    });
const LoginAppleButton = ({ sendEmail, submitSuccessFc }: { sendEmail?: Function; submitSuccessFc?: Function }) => {
    const dispatch = useDispatch();
    const handleLoginInSuccess = async (event: any) => {
        if (event?.detail?.authorization?.id_token) {
            let decode: any = jwt.decode(event.detail.authorization.id_token, {
                verify_signature: false,
            });
            if (decode.email) {
                if (sendEmail) {
                    await sendEmail(decode.email);
                }
                if (submitSuccessFc) {
                    submitSuccessFc();
                }
                ga.event({
                    action: "login_by_apple_success",
                    params: {
                        email: decode.email,
                    },
                });

                dispatch(
                    loginSuccess(
                        new UserInfo({
                            email: decode.email,
                            id: decode.email,
                        })
                    )
                );
            }
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
        if (!APPLE_CLIENT_ID) {
            return;
        }
        const src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";

        loadScript(src)
            .then(() => {
                if (typeof window !== "undefined" && window?.AppleID) {
                    window.AppleID.auth.init({
                        clientId: APPLE_CLIENT_ID, // This is the service ID we created.
                        scope: "email", // To tell apple we want the user name and emails fields in the response it sends us.
                        redirectURI: isProduction() ? window.location.origin : "https://dev.cdl-prep.com", // As registered along with our service ID
                        usePopup: true,
                        responseMode: "form_post",
                    });
                    document.addEventListener("AppleIDSignInOnSuccess", handleLoginInSuccess);
                    document.addEventListener("AppleIDSignInOnFailure", handleLoginFailed);
                    // setLoading(false);
                }
            })
            .catch((error) => {
                console.error("error", error);
            });
        return () => {
            const scriptTag = document.querySelector(`script[src="${src}"]`);
            if (scriptTag) document.body.removeChild(scriptTag);
            document.removeEventListener("AppleIDSignInOnSuccess", handleLoginInSuccess);
            document.removeEventListener("AppleIDSignInOnFailure", handleLoginFailed);
        };
    }, []);
    return (
        <div className="w-full flex justify-center">
            {APPLE_CLIENT_ID && (
                <div
                    className="apple-button "
                    onClick={() => {
                        if (window && window?.AppleID) {
                            window.AppleID.auth.signIn();
                        }
                    }}
                >
                    <div className="apple-icon">
                        <AppleIcon htmlColor="#fff" />
                    </div>
                    <span>Login with Apple</span>
                </div>
            )}
        </div>
    );
};
export default LoginAppleButton;

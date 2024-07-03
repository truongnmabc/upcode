import jwt from "jsonwebtoken";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as ga from "../../services/ga";
import "./index.scss";
import { UserInfo } from "@/models/UserInfo";
import { loginSuccess } from "@/redux/features/user";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ID;

const GoogleAuth = ({ submitSuccessFc }: { submitSuccessFc?: Function }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const src = "https://accounts.google.com/gsi/client";
        const addScriptGG = async () => {
            // await loadScript(src);
            if (typeof window !== "undefined" && window?.google && GOOGLE_CLIENT_ID?.length) {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: (res: any) => handleCredentialResponse(res),
                    cancel_on_tap_outside: false,
                });

                window.google.accounts.id.renderButton(document.getElementById("loginWithGoogle"), {
                    theme: "outline",
                    size: "large",
                    logo_alignment: "center",
                    type: "standard",
                    width: window.innerWidth < 769 ? window.innerWidth - 24 - 24 : 332,
                    text: "signin_with",
                    locale: "en-us",
                });
            }
        };

        try {
            addScriptGG();
        } catch (error) {
            console.log("error", error);
        }
        return () => {
            try {
                const scriptTag = document.querySelector(`script[src="${src}"]`);
                if (scriptTag) document?.body?.removeChild(scriptTag);
            } catch (error) {
                // console.log("error", error);
            }
        };
    }, [window.google, window]);

    async function handleCredentialResponse(response) {
        let accountInfo = jwt.decode(response.credential);
        let email = accountInfo.email.toLowerCase();
        let avatar = accountInfo.picture;
        let name = accountInfo.name;
        try {
            if (submitSuccessFc) {
                submitSuccessFc();
            }
            ga.event({ action: "login_success_google", params: {} });
            dispatch(loginSuccess({ userInfo: new UserInfo({ email, id: email, avatar, name }) }));
        } catch (error) {}
    }
    return (
        <div className="login-container-btn" id="google-login-button">
            <div
                id="loginWithGoogle"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                }}
            ></div>
        </div>
    );
};

export default GoogleAuth;

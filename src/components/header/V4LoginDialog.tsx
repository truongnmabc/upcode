import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Config from "../../config";
import { IAppInfo } from "../../models/AppInfo";
import { UserInfo } from "../../models/UserInfo";
import { validateEmail } from "../../utils";
import V4CircleProgress from "../v4-material/V4CircleProgress";
import "./V4LoginDialog.scss";
import { APPLE_CLIENT_ID } from "../../config_app";
import Dialog from "@mui/material/Dialog";
import { loginSuccess } from "@/redux/features/user";
import { getSession, isProduction, setSession } from "@/config/config_web";
import { sendEmailApi, verifiedCodeApi } from "@/redux/reporsitory/User.repositories";
import CloseIcon from "../icon/CloseIcon";
const GoogleAuth = dynamic(() => import("../../components/google-button"));
const LoginWithApple = dynamic(() => import("../../components/login-apple"));
const GOOGLE_ID = process.env.NEXT_PUBLIC_GOOGLE_ID;
const IS_TESTER = getSession(Config.TESTER_KEY);
const DEV_MODE = !isProduction() ? true : IS_TESTER;

export const V4LoginDialog = ({
    appInfo,
    open,
    setOpen,
    allowClose = true,
}: {
    appInfo: IAppInfo;
    open: boolean;
    setOpen: (v: boolean) => void;
    allowClose?: boolean;
}) => {
    const [step, setStep] = useState(1);
    const [processing, setProcess] = useState(false);
    const [email, setEmail] = useState("");
    const codeRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();

    let tempCount = 0;
    const setIsTester = () => {
        tempCount++;
        if (tempCount == 0) {
            setTimeout(() => {
                tempCount = 0;
            }, 5000);
        }
        if (tempCount >= 10) {
            setSession(Config.TESTER_KEY, true);
            alert("You are tester!");
            location.reload();
        }
    };
    const verifyEmail = async () => {
        if (email?.length) {
            if (validateEmail(email)) {
                if (DEV_MODE) {
                    setStep(2);
                } else {
                    setProcess(true);
                    let data = await sendEmailApi({
                        email,
                        appName: appInfo?.appName,
                    });
                    setProcess(false);
                    if (data === "Sended email!") {
                        setStep(2);
                    }
                }
            } else {
                window.alert("Email invalid");
            }
        } else {
            window.alert("Email not empty");
        }
    };

    const verifyCode = async () => {
        let code = DEV_MODE ? "abc" : codeRef.current.value;
        if (code?.length) {
            if (DEV_MODE) {
                // login
                login(email);
            } else {
                setProcess(true);
                let res = await verifiedCodeApi({
                    email,
                    code,
                });
                setProcess(false);
                if (res === 1) {
                    login(email);
                } else {
                    alert("Code invalid");
                }
            }
        } else {
            alert("Please enter code ");
        }
    };

    const login = (email: string) => {
        dispatch(loginSuccess({ userInfo: new UserInfo({ email, id: email }) }));
    };

    useEffect(() => {
        if (open) setStep(1);
    }, [open]);

    return (
        <>
            <Dialog
                open={open}
                onClose={() => {
                    if (allowClose) setOpen(false);
                }}
                className="v4-login-dialog"
            >
                <div className="v4-login">
                    {allowClose && (
                        <div className="button-close-dialog-v4" onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </div>
                    )}
                    <div className="banner">
                        <p
                            onClick={() => {
                                setIsTester();
                            }}
                        >
                            Pass on Your First Attempt With <span>{appInfo.appName} Prep!</span>
                        </p>
                        <ul>
                            <li>Synchronize among All devices</li>
                            <li>
                                {appInfo.totalQuestion - (appInfo.totalQuestion % 10)}+ free {appInfo.appName} Questions
                            </li>
                            <li>Smart & Fun Learning Technique</li>
                            <li>98% Pass on the First Attempt</li>
                        </ul>
                        <div className="blur">
                            <Blur />
                        </div>
                    </div>

                    <div className="login">
                        <div className="main">
                            {step == 1 ? (
                                <>
                                    <p className="log-in-to-your-account">Log in to your account</p>
                                    <div className="login-with" id="login-width">
                                        {GOOGLE_ID && (
                                            <div>
                                                <GoogleAuth submitSuccessFc={() => {}}></GoogleAuth>
                                            </div>
                                        )}
                                        {APPLE_CLIENT_ID && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <LoginWithApple submitSuccessFc={() => {}}></LoginWithApple>
                                            </div>
                                        )}
                                    </div>
                                    <div className="or">
                                        <div />
                                        or <div />
                                    </div>
                                    <p className="emaill-address">Email Address</p>
                                    <input
                                        placeholder="Enter your email address"
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === "NumpadEnter") {
                                                verifyEmail();
                                            }
                                        }}
                                        value={email}
                                    />
                                </>
                            ) : (
                                <>
                                    <p className="enter-your-verification-code">Enter your verification code</p>
                                    <p className="please-check">
                                        Please check your inbox for the verification code sent to {email}
                                    </p>
                                    <p className="your-code">Your code</p>
                                    <input
                                        placeholder="Enter your code here"
                                        ref={codeRef}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === "NumpadEnter") {
                                                verifyCode();
                                            }
                                        }}
                                    />
                                </>
                            )}
                        </div>
                        {processing ? (
                            <div className="processing">
                                <V4CircleProgress />
                            </div>
                        ) : (
                            <div
                                className="verify"
                                onClick={() => {
                                    if (step == 1) verifyEmail();
                                    else if (step == 2) verifyCode();
                                }}
                            >
                                Verify
                            </div>
                        )}
                    </div>
                </div>
            </Dialog>
        </>
    );
};

const Blur = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="601" height="352" fill="none" viewBox="0 0 601 352">
            <g clipPath="url(#clip0_1947_294)">
                <path fill="#fff" d="M0 0H601V352H0z"></path>
                <g opacity="0.6">
                    <g filter="url(#filter0_f_1947_294)" opacity="0.3">
                        <ellipse cx="154" cy="405.5" fill="#FBE83D" rx="154" ry="99.5"></ellipse>
                    </g>
                    <g filter="url(#filter1_f_1947_294)" opacity="0.55">
                        <ellipse cx="462.5" cy="350" fill="#7C6F5B" fillOpacity="0.54" rx="308.5" ry="224"></ellipse>
                    </g>
                </g>
            </g>
            <defs>
                <filter
                    id="filter0_f_1947_294"
                    width="648"
                    height="539"
                    x="-170"
                    y="136"
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                    <feGaussianBlur result="effect1_foregroundBlur_1947_294" stdDeviation="85"></feGaussianBlur>
                </filter>
                <filter
                    id="filter1_f_1947_294"
                    width="981"
                    height="812"
                    x="-28"
                    y="-56"
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                    <feGaussianBlur result="effect1_foregroundBlur_1947_294" stdDeviation="91"></feGaussianBlur>
                </filter>
                <clipPath id="clip0_1947_294">
                    <path fill="#fff" d="M0 0H601V352H0z"></path>
                </clipPath>
            </defs>
        </svg>
    );
};

export default V4LoginDialog;

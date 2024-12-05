"use client";

import LoadingButton from "@mui/lab/LoadingButton";
import React, { useState } from "react";
import InputCodeVerify from "./inputCodeLogin";
import InputEmailAddress from "./inputEmailLogin";
import { IS_TESTER } from "@/common/constants";
import { useAppSelector } from "@/lib/redux/hooks";
import { appInfoState } from "@/lib/redux/features/appInfo";
import { sendEmailApi, verifiedCodeApi } from "@/lib/services/home.service";
import { appConfigState } from "@/lib/redux/features/appConfig";
import GoogleAuthButton from "../google-button";
// const GoogleAuthButton = dynamic(() => import("../google-button"));
const GOOGLE_ID = process.env.NEXT_PUBLIC_GOOGLE_ID;

const FN = () => {
  const [step, setStep] = useState(1);
  const [processing, setProcess] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const login = (email: string) => {
    // dispatch(loginSuccess(new UserInfo({ email, id: email })));
  };
  const { appInfo } = useAppSelector(appInfoState);
  const { appConfig } = useAppSelector(appConfigState);
  const verifyEmail = async () => {
    setProcess(true);
    try {
      if (email?.length) {
        if (IS_TESTER) {
          setStep(2);
        } else {
          let data = await sendEmailApi({
            email,
            appName: appInfo?.appName,
          });
          if (data === "Sended email!") {
            setStep(2);
          }
        }
      } else {
        window.alert("Email not empty");
      }
    } catch (err) {
      console.log("🚀 ~ verifyEmail ~ err:", err);
    } finally {
      setProcess(false);
    }
  };

  const verifyCode = async () => {
    setProcess(true);
    try {
      let res = await verifiedCodeApi({
        email,
        code,
      });
      if (res === 1) {
        login(email);
      } else {
        alert("Code invalid");
      }
    } catch (err) {
      console.log("🚀 ~ verifyCode ~ err:", err);
    } finally {
      setProcess(false);
    }
  };

  return (
    <div className="login">
      <div className="main">
        {step == 1 ? (
          <div className="flex flex-col gap-4">
            <p className="log-in-to-your-account">Log in to your account</p>
            {GOOGLE_ID && <GoogleAuthButton />}
            {/* {appConfig.appleClientId && <LoginAppleButton />} */}
            {(GOOGLE_ID || appConfig.appleClientId) && (
              <div className="or">
                <div />
                or <div />
              </div>
            )}
            <p className="emaill-address">Email Address</p>
            <InputEmailAddress onEnter={verifyEmail} onChangeValue={setEmail} />
          </div>
        ) : (
          <>
            <p className="enter-your-verification-code">
              Enter your verification code
            </p>
            <p className="please-check">
              Please check your inbox for the verification code sent to {email}
            </p>
            <p className="your-code">Your code</p>
            <InputCodeVerify onChangeValue={setCode} onEnter={verifyCode} />
          </>
        )}
      </div>

      <LoadingButton
        className="verify"
        loading={processing}
        disabled={processing}
        onClick={() => {
          if (step == 1) verifyEmail();
          if (step == 2) verifyCode();
        }}
      >
        <div className="h-6 text-white capitalize">
          {!processing && "Verify"}
        </div>
      </LoadingButton>
    </div>
  );
};
const VerifyLogin = React.memo(FN);
export default VerifyLogin;

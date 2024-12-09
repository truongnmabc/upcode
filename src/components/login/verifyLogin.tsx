"use client";

import CloseIcon from "@/asset/icon/CloseIcon";
import { IS_TESTER } from "@/common/constants";
import { appConfigState } from "@/lib/redux/features/appConfig";
import { appInfoState } from "@/lib/redux/features/appInfo";
import { useAppSelector } from "@/lib/redux/hooks";
import { sendEmailApi, verifiedCodeApi } from "@/lib/services/home.service";
import AppleIcon from "@mui/icons-material/Apple";
import GoogleIcon from "@mui/icons-material/Google";
import Divider from "@mui/material/Divider";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { MtUiButton } from "../button";
import InputCodeVerify from "./inputCodeLogin";
import InputEmailAddress from "./inputEmailLogin";

const GOOGLE_ID = process.env.NEXT_PUBLIC_GOOGLE_ID;

const FN = ({ setOpen }: { setOpen: (e: boolean) => void }) => {
  const [step, setStep] = useState(1);
  const [processing, setProcess] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const login = () => {
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
          const data = await sendEmailApi({
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
      const res = await verifiedCodeApi({
        email,
        code,
      });
      if (res === 1) {
        login();
      } else {
        alert("Code invalid");
      }
    } catch (err) {
      console.log("🚀 ~ verifyCode ~ err:", err);
    } finally {
      setProcess(false);
    }
  };

  // const { data: session } = useSession();
  return (
    <div className="w-full sm:w-1/3 flex flex-col justify-between px-4 py-6 h-full">
      <div className="flex flex-col gap-8 ">
        <div className=" fixed sm:static top-3 left-8 right-8 z-20 flex justify-end">
          <div
            className="rounded-full p-1 cursor-pointer hover:bg-[#2121211f] w-fit h-fit "
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon />
          </div>
        </div>
        <div className="flex-1">
          {step == 1 ? (
            <div className="flex flex-col gap-4">
              <p className="text-center font-medium text-2xl">
                Log in to your account
              </p>

              <MtUiButton
                type="default"
                className="border-[#2121211f] rounded-md"
                onClick={() => {
                  signIn();
                }}
                size="large"
              >
                <div className="flex gap-1 items-center">
                  <GoogleIcon />
                  <p>Sign in with Google</p>
                </div>
              </MtUiButton>
              {appConfig.appleClientId && (
                <MtUiButton
                  className="border-[#2121211f] rounded-md"
                  onClick={() => {
                    signIn("apple");
                  }}
                  size="large"
                >
                  <div className="flex gap-1 items-center">
                    <AppleIcon />
                    <p>Login with Apple</p>
                  </div>
                </MtUiButton>
              )}

              {(GOOGLE_ID || appConfig.appleClientId) && (
                <div className="flex w-full items-center justify-between gap-1">
                  <Divider className="flex-1" />
                  <span className="text-xs text-[#c4c4c4]">or</span>
                  <Divider className="flex-1" />
                </div>
              )}
              <p>Email Address</p>
              <InputEmailAddress
                onEnter={verifyEmail}
                onChangeValue={setEmail}
              />
            </div>
          ) : (
            <div className="flex flex-col  gap-8">
              <p className="text-2xl text-center px-6  font-semibold">
                Enter your verification code
              </p>
              <p className="text-sm text-center px-6 text-[#949494] ">
                Please check your inbox for the verification code sent to{" "}
                {email}
              </p>
              <div className="w-full">
                <p className="text-sm pb-4">Your code</p>
                <InputCodeVerify onChangeValue={setCode} onEnter={verifyCode} />
              </div>
            </div>
          )}
        </div>
      </div>
      <MtUiButton
        loading={processing}
        disabled={step == 1 ? email?.length === 0 : code?.length === 0}
        onClick={() => {
          if (step == 1) verifyEmail();
          if (step == 2) verifyCode();
        }}
        type="primary"
        size="large"
        className="mb-4 sm:mb-0"
      >
        Verify
      </MtUiButton>
    </div>
  );
};
const VerifyLogin = React.memo(FN);
export default VerifyLogin;

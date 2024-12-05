"use client";
import React from "react";
import Blur from "./blur";
import { useAppSelector } from "@/lib/redux/hooks";
import { appInfoState } from "@/lib/redux/features/appInfo";
import { TESTER_KEY } from "@/common/constants";
import { setSession } from "@/utils/session";

const FN = () => {
  const { appInfo } = useAppSelector(appInfoState);

  let tempCount = 0;

  const setIsTester = () => {
    tempCount++;
    if (tempCount == 0) {
      setTimeout(() => {
        tempCount = 0;
      }, 5000);
    }
    if (tempCount >= 10) {
      setSession(TESTER_KEY, true);
      alert("You are tester!");
      location.reload();
    }
  };
  return (
    <div className="banner">
      <p onClick={setIsTester}>
        Pass on Your First Attempt With <span>{appInfo.appName} Prep!</span>
      </p>
      <ul>
        <li>Synchronize among All devices</li>
        <li>
          {appInfo.totalQuestion - (appInfo.totalQuestion % 10)}+ free{" "}
          {appInfo.appName} Questions
        </li>
        <li>Smart & Fun Learning Technique</li>
        <li>98% Pass on the First Attempt</li>
      </ul>
      <div className="blur">
        <Blur />
      </div>
    </div>
  );
};
const BannerModalLogin = React.memo(FN);
export default BannerModalLogin;

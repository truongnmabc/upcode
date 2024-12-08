"use client";
import { appInfoState } from "@/lib/redux/features/appInfo";
import { useAppSelector } from "@/lib/redux/hooks";
import React, { CSSProperties } from "react";
import "./styles.css";

import IconLinkStoreApp from "@/components/iconLinkStoreApp";
import QRCode from "react-qr-code";

const DownloadApp = () => {
  const { appInfo } = useAppSelector(appInfoState);
  const features = [
    {
      title: "No internet required",
      icon: (
        <img
          alt="No internet required"
          src="/images/home/v4-no-internet-required.webp"
          width={24}
          height={24}
        />
      ),
      mobile: false,
    },
    {
      title:
        appInfo.totalQuestion -
        (appInfo.totalQuestion % 10) +
        "+ unique questions",
      icon: (
        <img
          alt="unique questions"
          src="/images/home/v4-unique-questions.webp"
          width={24}
          height={24}
        />
      ),
      mobile: true,
    },
    {
      title: "Easy to use",
      icon: (
        <img
          alt="easy to use"
          src="/images/home/v4-easy-to-use.webp"
          width={24}
          height={24}
        />
      ),
      mobile: false,
    },
    {
      title: "Instant feedback",
      icon: (
        <img
          alt="Instant feedback"
          src="/images/home/v4-instant-feedback.webp"
          width={24}
          height={24}
        />
      ),
      mobile: true,
    },
    {
      title: "No registration",
      icon: (
        <img
          alt="No registration"
          src="/images/home/v4-no-registration.webp"
          width={24}
          height={24}
        />
      ),
      mobile: false,
    },
    {
      title: appInfo.hasState ? "State Specific" : "Track passing probability",
      icon: (
        <img
          alt={
            appInfo.hasState ? "State Specific" : "Track passing probability"
          }
          src="/images/home/v4-track-passing-probability.webp"
          width={24}
          height={24}
        />
      ),
      mobile: true,
    },
  ];
  const customStyles: CSSProperties & Record<string, string> = {
    "--img-mobile-url": `url(/images/home/banner-download-app-mobile.webp)`,
    "--img-desktop-url": `url(/images/home/banner-download-app-desktop.webp)`,
    "--background-mobile-url": `url(/images/home/ballon-mobile.svg)`,
    "--background-desktop-url": `url(/images/home/ballon-desktop.svg)`,
  };
  return (
    <div className={"v4-banner-download-app-0 v4-border-radius"}>
      <div className="v4-banner-download-app-1">
        <div className="v4-banner-download-app-11">
          <figure
            className="v4-banner-download-app-background"
            style={customStyles}
          ></figure>
          <div className="v4-banner-download-app-content-0">
            <div>
              <strong>DOWNLOAD</strong> OUR APP
            </div>

            <div className="v4-banner-download-app-grid-feature-0">
              {features?.map((f) => (
                <div className="grid-feature-item" key={f.title}>
                  {f.icon}
                  <span>{f.title}</span>
                </div>
              ))}
            </div>

            <div className="grid-feature-item">
              {features
                .filter((f) => f?.mobile)
                .map((f) => f.title)
                .join(" - ")}
            </div>

            <div className="v4-banner-download-app-method-0">
              <div className="flex flex-col gap-2">
                <IconLinkStoreApp type="ios" />
                <IconLinkStoreApp type="android" />
              </div>

              <div className="v4-banner-download-app-method-qr w-[50px] sm:w-[118px]">
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={`/qrcode-redirect/?appNameId=${appInfo.appNameId}`}
                  viewBox={`0 0 256 256`}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="v4-banner-download-app-12">
          <figure style={customStyles} />
        </div>
      </div>
    </div>
  );
};
export default React.memo(DownloadApp);

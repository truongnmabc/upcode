"use client";

import { IContactInfo, listContactApp } from "@/common/constants";

export const getContactApp = (appName: string): IContactInfo => {
  return (
    listContactApp[appName] || {
      facebook: "",
      youtube: "",
      twitter: "",
    }
  );
};

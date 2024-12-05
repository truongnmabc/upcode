"use client";
import { db } from "@/lib/db/db.model";
import { studyState } from "@/lib/redux/features/study";
import { useAppSelector } from "@/lib/redux/hooks";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export const extractKey = (pathname: string): string | null => {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length >= 3 && parts[2].endsWith("-practice-test")) {
    const key = parts[2].replace("-practice-test", "");
    return key.replaceAll("-", " ");
  }
  return null;
};

const TitleQuestion = () => {
  const pathname = usePathname();
  const defaultTitle = extractKey(pathname);
  // const [title, setTitle] = useState(defaultTitle);
  // const { selectedTopics } = useAppSelector(studyState);

  // const handleGetData = async () => {
  //   const list = await db.topics.get(selectedTopics);
  //   if (list) setTitle(list?.name);
  // };

  // useEffect(() => {
  //   if (selectedTopics) handleGetData();
  // }, [selectedTopics]);
  return (
    <div className="w-full text-center capitalize text-xl font-semibold">
      {defaultTitle}
    </div>
  );
};

export default React.memo(TitleQuestion);

"use client";
import RouterApp from "@/common/router/router.constant";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ITopic } from "@/models/topics/topics";
import { studyState } from "@/redux/features/study";
import { useAppSelector } from "@/redux/hooks";
import ctx from "@/utils/mergeClass";
import { convertPathName } from "@/utils/pathName";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { AllowExpandContext, IContextAllowExpand } from "./provider";
import TitleCollapse from "./titleCollapse";

const FN = () => {
  const pathname = usePathname();
  const { color, mainTopic } =
    useContext<IContextAllowExpand>(AllowExpandContext);
  const [currentPathname, setCurrentPathname] = useState<string | null>(null);
  const { selectedTopics } = useAppSelector(studyState);
  const isAllowExpand = selectedTopics === mainTopic?.id;
  const isMobile = useIsMobile();

  useEffect(() => {
    const path = convertPathName(pathname);
    setCurrentPathname(path);
  }, [pathname]);
  if (currentPathname === null) return null;

  if (!isMobile && currentPathname === RouterApp.Home) return <></>;
  return (
    <div
      style={{
        borderColor: isAllowExpand ? color : "transparent",
      }}
      className={ctx("bg-white transition-all p-3", {
        "border border-t-0 rounded-bl-md rounded-br-md border-solid":
          isAllowExpand && currentPathname === RouterApp.Home,
        " rounded-md": currentPathname !== RouterApp.Home,
        hidden: !isAllowExpand,
      })}
    >
      <div className="flex gap-2 flex-col ">
        {mainTopic?.topics &&
          mainTopic?.topics?.length > 0 &&
          mainTopic?.topics?.map((subTopic: ITopic, index) => (
            <TitleCollapse subTopic={subTopic} key={index} />
          ))}
      </div>
    </div>
  );
};

const AllowExpand = React.memo(FN);

export default AllowExpand;

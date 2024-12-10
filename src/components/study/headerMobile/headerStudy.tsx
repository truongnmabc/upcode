"use client";

import IconBack from "@/components/icon/iconBack";
import { useIsMobile } from "@/hooks/useIsMobile";
import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";
import React, { Fragment, useState } from "react";
import MobileDrawerConfirmExit from "./mobileDrawerConfirmExit";

const HeaderStudy = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { indexCurrentQuestion, listQuestion } = useAppSelector(gameState);
  const isMobile = useIsMobile();
  const partGame = useSearchParams().get("part");

  if (!isMobile) return <></>;

  return (
    <Fragment>
      <div className="flex items-center mt-2 justify-between w-full">
        <div
          onClick={() => {
            setOpenDrawer(!openDrawer);
          }}
          className="cursor-pointer"
        >
          <IconBack size={20} />
        </div>

        <div className=" text-center flex-1 capitalize text-sm font-medium">
          {partGame?.replaceAll("-", " ")}
        </div>
        <div className=" text-sm font-normal ">
          {indexCurrentQuestion + 1}/{listQuestion?.length}
        </div>
      </div>
      <MobileDrawerConfirmExit open={openDrawer} setOpen={setOpenDrawer} />
    </Fragment>
  );
};

export default React.memo(HeaderStudy);

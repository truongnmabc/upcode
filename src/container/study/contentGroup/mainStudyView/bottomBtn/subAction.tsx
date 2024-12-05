import IconBookmark from "@/components/icon/iconBookmark";
import IconDislike from "@/components/icon/iconDislike";
import IconLike from "@/components/icon/iconLike";
import { Dialog } from "@mui/material";
import React, { useState } from "react";
import ReportMistake from "./reportMistake";

const SubAction = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="flex items-center gap-4">
      <div
        className=" cursor-pointer"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <IconBookmark />
      </div>
      <div className=" cursor-pointer">
        <IconLike />
      </div>
      <div className=" cursor-pointer">
        <IconDislike />
      </div>
      <Dialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <ReportMistake />
      </Dialog>
    </div>
  );
};

export default React.memo(SubAction);

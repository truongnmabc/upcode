"use client";
import ModalLogin from "@/components/login";
import ctx from "@/utils/mergeClass";
import { Button } from "@mui/material";
import React, { useState } from "react";

const FN = ({ classNames }: { classNames?: string }) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="hidden sm:block">
      <Button
        onClick={() => {
          setOpenModal(true);
        }}
        sx={{
          textTransform: "capitalize",
          ":hover": {
            backgroundColor: "transparent",
          },
        }}
        className="gap-3  items-center"
      >
        <div
          className={ctx(
            "text-base font-normal hover:text-primary cursor-pointer text-[var(--text-color)]",
            classNames
          )}
        >
          Login
        </div>
      </Button>
      <ModalLogin open={openModal} setOpen={setOpenModal} />
    </div>
  );
};
const LoginHeader = React.memo(FN);
export default LoginHeader;

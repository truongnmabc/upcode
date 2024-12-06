"use client";
import Dialog from "@mui/material/Dialog";
import React from "react";
import CloseIcon from "@/asset/icon/CloseIcon";
import BannerModalLogin from "./bannerModalLogin";
import VerifyLogin from "./verifyLogin";

export const FN = ({
  open,
  setOpen,
  allowClose = true,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  allowClose?: boolean;
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (allowClose) setOpen(false);
      }}
      className="v4-login-dialog"
    >
      <div className="v4-login">
        {allowClose && (
          <div
            className="button-close-dialog-v4"
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </div>
        )}
        <BannerModalLogin />
        <VerifyLogin />
      </div>
    </Dialog>
  );
};

const ModalLogin = React.memo(FN);

export default ModalLogin;

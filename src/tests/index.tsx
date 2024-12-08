"use client";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { Fragment, useState } from "react";
import ModalTest from "./modal";
const TestModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <div
        onClick={() => {
          setOpen(true);
        }}
        className=" fixed bottom-14  p-2 rounded-full shadow-lg bg-black opacity-60 cursor-pointer   left-2 z-50"
      >
        <SettingsSuggestIcon htmlColor="white" />
      </div>
      <ModalTest open={open} setOpen={setOpen} />
    </Fragment>
  );
};

export default TestModal;

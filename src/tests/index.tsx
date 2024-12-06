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
                className=" fixed bottom-4 p-2 rounded-full shadow-lg bg-black cursor-pointer   right-8 z-50"
            >
                <SettingsSuggestIcon htmlColor="white" />
            </div>
            <ModalTest open={open} setOpen={setOpen} />
        </Fragment>
    );
};

export default TestModal;

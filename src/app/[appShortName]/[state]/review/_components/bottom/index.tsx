"use client";
import { MtUiButton } from "@/components/button";
import dynamic from "next/dynamic";
import { useCallback, useContext, useState } from "react";
import { ReviewContext } from "../context";
import { Dialog } from "@mui/material";
import ChoiceQuestionBeforeStart from "../content/random/choiceQuestionBeforeStart";
const Sheet = dynamic(() => import("@/components/sheet"), {
    ssr: false,
});

const BottomLestTest = () => {
    const { selectType } = useContext(ReviewContext);
    const [open, setOpen] = useState(false);

    const handleOpen = useCallback(() => setOpen(true), []);

    const handleClose = useCallback(() => setOpen(false), []);

    const handleStartTest = useCallback(() => {
        handleClose();
    }, [handleClose]);

    if (
        selectType === "saved" ||
        selectType === "weak" ||
        selectType === "all"
    ) {
        return (
            <div className=" fixed z-20 bottom-0 left-0 right-0 h-fit">
                <div className="w-full h-full  py-4 bg-[#F9F7EE] flex items-center justify-center">
                    <MtUiButton
                        type="primary"
                        className="text-base px-10"
                        size="large"
                        onClick={handleOpen}
                    >
                        Let's Review
                    </MtUiButton>
                </div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    sx={{
                        "& .MuiDialog-paper": {
                            width: "100%",
                            maxWidth: "900px",
                            maxHeight: "240px",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            borderRadius: "12px",
                        },
                    }}
                >
                    <p className="text-2xl pt-6 font-semibold text-center">
                        How many questions do you want?
                    </p>
                    <ChoiceQuestionBeforeStart
                        handleStartTest={handleStartTest}
                    />
                </Dialog>
            </div>
        );
    }
    return <></>;
};

export default BottomLestTest;

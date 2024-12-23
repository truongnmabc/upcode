"use client";
import React, { useCallback, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { MtUiButton } from "@/components/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { continueGame, gameState, startOverGame } from "@/redux/features/game";
import { db } from "@/db/db.model";
import pauseTestThunk from "@/redux/repository/game/pauseAndResumed/pauseTest";
import resumedTestThunk from "@/redux/repository/game/pauseAndResumed/resumedTest";
import { usePathname, useSearchParams } from "next/navigation";
import initDiagnosticTestQuestionThunk from "@/redux/repository/game/initData/initDiagnosticTest";
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ModalConfirm = () => {
    const [open, setOpen] = React.useState(false);
    const pathname = usePathname();
    const typeParam = useSearchParams().get("type");
    const dispatch = useAppDispatch();
    const { isPaused, idTopic, type } = useAppSelector(gameState);

    const handleStartOver = useCallback(async () => {
        await dispatch(
            resumedTestThunk({
                type:
                    typeParam === "test"
                        ? "practiceTest"
                        : pathname?.includes("custom_test")
                        ? "customTest"
                        : pathname?.includes("final_test")
                        ? "finalTest"
                        : "diagnosticTest",
            })
        );
        if (pathname?.includes("diagnostic_test")) {
            dispatch(initDiagnosticTestQuestionThunk());
        }

        dispatch(startOverGame());
        setOpen(false);
    }, [idTopic, typeParam, pathname]);

    const handleContinue = useCallback(() => {
        dispatch(continueGame());
        setOpen(false);
    }, [dispatch]);

    useEffect(() => {
        return () => {
            setOpen(false);
            if (idTopic && idTopic !== -1 && type === "test") {
                dispatch(
                    pauseTestThunk({
                        testId: idTopic,
                    })
                );
            }
        };
    }, [idTopic, type]);

    useEffect(() => {
        if (isPaused) {
            setTimeout(() => setOpen(true), 200);
        }
    }, [isPaused, idTopic]);

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            aria-describedby="alert-dialog-slide-description"
            sx={{
                "& .MuiPaper-root": {
                    borderRadius: "12px",
                },
            }}
        >
            <div className=" p-6 rounded-xl max-w-[380px]  bg-[#F9F7EE]">
                <p className="text-lg font-medium text-center font-poppins">
                    You are in the middle of this test. Do you want to continue?
                </p>

                <div className="mt-6 w-full flex items-center justify-between gap-4">
                    <MtUiButton
                        block
                        className="text-base font-medium py-[10px] "
                        onClick={handleStartOver}
                        animated
                    >
                        Start over
                    </MtUiButton>

                    <MtUiButton
                        className="text-base text-primary border-primary font-medium py-[10px] "
                        block
                        type="primary"
                        animated
                        onClick={handleContinue}
                    >
                        Continue
                    </MtUiButton>
                </div>
            </div>
        </Dialog>
    );
};

export default ModalConfirm;

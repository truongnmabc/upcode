import React, { useCallback, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { MtUiButton } from "@/components/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { continueGame, gameState, startOverGame } from "@/redux/features/game";
import { db } from "@/db/db.model";
import pauseTestThunk from "@/redux/repository/game/pauseTest";
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

    const { isPaused, idTopic } = useAppSelector(gameState);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const handleStartOver = useCallback(async () => {
        setLoading(true);
        await db?.testQuestions
            .where("parentId")
            .equals(idTopic)
            .modify((item) => {
                item.isPaused = false;
                item.startTime = new Date().getTime();
                item.remainTime = item.duration * 60;
            })
            .then((res) => console.log("handleStartOver ~ update db", res))
            .catch((err) => console.log("err", err));

        await db?.userProgress
            .where("parentId")
            .equals(idTopic)
            .and((item) => item.type === "test")
            .delete()
            .then((res) => console.log("delete success", res));

        dispatch(startOverGame());

        setLoading(true);
        setOpen(false);
    }, [idTopic]);

    const handleContinue = () => {
        dispatch(continueGame());
        setOpen(false);
    };

    useEffect(() => {
        return () => {
            if (idTopic && idTopic !== -1) {
                console.log("🚀 ~ unmount ~ idTopic:", idTopic);
                dispatch(
                    pauseTestThunk({
                        testId: idTopic,
                    })
                );
            }
        };
    }, [idTopic]);

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
                        className="text-base text-primary border-primary font-medium py-[10px] "
                        block
                        onClick={handleContinue}
                    >
                        Continue
                    </MtUiButton>

                    <MtUiButton
                        block
                        type="primary"
                        className="text-base font-medium py-[10px] "
                        onClick={handleStartOver}
                        loading={loading}
                    >
                        Start over
                    </MtUiButton>
                </div>
            </div>
        </Dialog>
    );
};

export default ModalConfirm;

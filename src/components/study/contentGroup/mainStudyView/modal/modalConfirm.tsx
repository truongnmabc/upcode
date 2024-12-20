import React, { useCallback, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { MtUiButton } from "@/components/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { gameState, startOverGame } from "@/redux/features/game";
import { db } from "@/db/db.model";
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
    const handleStartOver = useCallback(async () => {
        await db?.testQuestions
            .where("parentId")
            .equals(idTopic)
            .modify((item) => {
                item.isPaused = false;
                item.startTime = new Date().getTime();
                item.remainTime = item.duration;
            })
            .then((res) => console.log("res", res))
            .catch((err) => console.log("err", err));
        dispatch(startOverGame());
        setOpen(false);
    }, [idTopic]);

    const handleContinue = () => setOpen(false);

    useEffect(() => {
        if (isPaused) {
            setTimeout(() => setOpen(true), 200);
        }
    }, [isPaused]);

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
                    >
                        Start over
                    </MtUiButton>
                </div>
            </div>
        </Dialog>
    );
};

export default ModalConfirm;

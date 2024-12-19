import React, { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { MtUiButton } from "@/components/button";
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ModalConfirm = () => {
    const [open, setOpen] = React.useState(true);

    const handleClickOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    useEffect(() => {}, []);

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
            sx={{
                "& .MuiPaper-root": {
                    borderRadius: "12px",
                    // border: "2px solid #ccc",
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
                    >
                        Continue
                    </MtUiButton>

                    <MtUiButton
                        block
                        type="primary"
                        className="text-base font-medium py-[10px] "
                    >
                        Start over
                    </MtUiButton>
                </div>
            </div>
        </Dialog>
    );
};

export default ModalConfirm;

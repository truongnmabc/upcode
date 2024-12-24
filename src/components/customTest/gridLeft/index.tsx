import { db } from "@/db/db.model";
import { ITestQuestion } from "@/models/tests/testQuestions";
import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";
import React, { Fragment, useEffect, useState } from "react";
import ModalSettingCustomTest from "../modal";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { MtUiButton } from "@/components/button";
const GridLeftCustomTest = () => {
    const [listTest, setListTest] = useState<ITestQuestion[]>([]);
    const [open, setOpen] = React.useState(false);

    const { listQuestion } = useAppSelector(gameState);
    useEffect(() => {
        const handleGetData = async () => {
            const list = await db?.testQuestions
                .where("type")
                .equals("customTets")
                .toArray();

            if (list?.length === 0) {
                setOpen(true);
            }
            if (list) {
                setListTest(list);
            }
        };
        handleGetData();
    }, [listQuestion?.length]);

    const onClose = () => setOpen(false);
    const onOpen = () => setOpen(true);
    const [openDelete, setOpenDelete] = React.useState(false);

    const handleClickOpen = () => {
        setOpenDelete(true);
    };

    const handleClose = () => {
        setOpenDelete(false);
    };
    return (
        <Fragment>
            <div className="flex justify-between items-center">
                <p className="font-semibold text-xl">Custom Test</p>
                <div
                    onClick={onOpen}
                    className="w-7 h-7 cursor-pointer rounded-full bg-[#21212114] flex items-center justify-center "
                >
                    <IconPlus />
                </div>
            </div>
            {listTest?.length > 0 && (
                <div className="flex flex-col gap-3 bg-white p-4 rounded-md">
                    {listTest?.map((item, index) => (
                        <div
                            key={index}
                            className="flex bg-[#2121210A] rounded-lg px-3 py-[10px] gap-2 justify-between items-center"
                        >
                            <p className="text-sm font-medium">
                                Custom Test {index + 1}
                            </p>
                            <div
                                className="flex items-center gap-2"
                                onClick={onOpen}
                            >
                                <div className="w-6 h-6 rounded flex cursor-pointer items-center justify-center bg-[#2121210F]">
                                    <IconEdit />
                                </div>
                                <div
                                    onClick={handleClickOpen}
                                    className="w-6 h-6 rounded flex items-center cursor-pointer justify-center bg-[#2121210F]"
                                >
                                    <IconDelete />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Dialog
                open={openDelete}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className="min-w-[400px] p-4">
                    <div className="pb-4">
                        Are you sure you want to delete this custom test?
                    </div>
                    <div className="w-full flex items-center gap-4 justify-center">
                        <MtUiButton block>Ok</MtUiButton>
                        <MtUiButton type="primary" block onClick={handleClose}>
                            {" "}
                            Cancel
                        </MtUiButton>
                    </div>
                </div>
            </Dialog>
            <ModalSettingCustomTest open={open} onClose={onClose} />
        </Fragment>
    );
};

export default GridLeftCustomTest;

const IconPlus = () => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M15.0003 10.8334H10.8337V15C10.8337 15.4584 10.4587 15.8334 10.0003 15.8334C9.54199 15.8334 9.16699 15.4584 9.16699 15V10.8334H5.00033C4.54199 10.8334 4.16699 10.4584 4.16699 10C4.16699 9.54169 4.54199 9.16669 5.00033 9.16669H9.16699V5.00002C9.16699 4.54169 9.54199 4.16669 10.0003 4.16669C10.4587 4.16669 10.8337 4.54169 10.8337 5.00002V9.16669H15.0003C15.4587 9.16669 15.8337 9.54169 15.8337 10C15.8337 10.4584 15.4587 10.8334 15.0003 10.8334Z"
                fill="#212121"
            />
        </svg>
    );
};

const IconEdit = () => {
    return (
        <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M7.33301 1.83331H5.99967C2.66634 1.83331 1.33301 3.16665 1.33301 6.49998V10.5C1.33301 13.8333 2.66634 15.1666 5.99967 15.1666H9.99967C13.333 15.1666 14.6663 13.8333 14.6663 10.5V9.16665"
                stroke="#5497FF"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10.6933 2.51332L5.43992 7.76665C5.23992 7.96665 5.03992 8.35999 4.99992 8.64665L4.71325 10.6533C4.60659 11.38 5.11992 11.8867 5.84659 11.7867L7.85325 11.5C8.13325 11.46 8.52659 11.26 8.73325 11.06L13.9866 5.80665C14.8933 4.89999 15.3199 3.84665 13.9866 2.51332C12.6533 1.17999 11.5999 1.60665 10.6933 2.51332Z"
                stroke="#5497FF"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9.94043 3.26666C10.3871 4.86 11.6338 6.10666 13.2338 6.56"
                stroke="#5497FF"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

const IconDelete = () => {
    return (
        <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M14 4.48665C11.78 4.26665 9.54667 4.15332 7.32 4.15332C6 4.15332 4.68 4.21999 3.36 4.35332L2 4.48665"
                stroke="#F14A4A"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5.66699 3.81331L5.81366 2.93998C5.92033 2.30665 6.00033 1.83331 7.12699 1.83331H8.87366C10.0003 1.83331 10.087 2.33331 10.187 2.94665L10.3337 3.81331"
                stroke="#F14A4A"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12.5669 6.59332L12.1336 13.3067C12.0603 14.3533 12.0003 15.1667 10.1403 15.1667H5.86026C4.00026 15.1667 3.94026 14.3533 3.86693 13.3067L3.43359 6.59332"
                stroke="#F14A4A"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M6.88672 11.5H9.10672"
                stroke="#F14A4A"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M6.33301 8.83331H9.66634"
                stroke="#F14A4A"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

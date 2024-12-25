import { MtUiButton } from "@/components/button";
import { db } from "@/db/db.model";
import { ITestQuestion } from "@/models/tests/testQuestions";
import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";
import Dialog from "@mui/material/Dialog";
import React, { Fragment, useEffect, useState } from "react";
import ModalSettingCustomTest from "../modal";
import { IconDelete, IconEdit, IconPlus } from "./iconGridLeft";
const GridLeftCustomTest = () => {
    const [listTest, setListTest] = useState<ITestQuestion[]>([]);
    const [openModalSetting, setOpenModalSetting] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [itemSelect, setItemSelect] = useState<ITestQuestion | null>(null);
    const { listQuestion } = useAppSelector(gameState);
    useEffect(() => {
        const handleGetData = async () => {
            const list = await db?.testQuestions
                .where("type")
                .equals("customTets")
                .toArray();

            if (list?.length === 0) {
                setOpenModalSetting(true);
            }
            if (list) {
                setListTest(list);
            }
        };
        handleGetData();
    }, [listQuestion?.length]);

    const onClose = () => {
        setOpenModalSetting(false);
        setItemSelect(null);
    };
    const handleOpenModalSetting = (e: ITestQuestion) => {
        setOpenModalSetting(true);
        setItemSelect(e);
    };

    const handleOpenModalDelete = (e: ITestQuestion) => {
        setItemSelect(e);
        setOpenDelete(true);
    };

    const handleClose = () => {
        setOpenDelete(false);
    };

    const handleDelete = async () => {
        if (itemSelect) {
            console.log("🚀 ~ handleDelete ~ itemSelect:", itemSelect);
            await db?.testQuestions
                .where("parentId")
                .equals(itemSelect?.parentId)
                .delete();
            await db?.userProgress
                .where("parentId")
                .equals(itemSelect?.parentId)
                .filter((item) => item.type === "test")
                .delete();

            setListTest((prev) =>
                prev.filter((item) => item.parentId !== itemSelect.parentId)
            );
            setOpenDelete(false);
        }
    };
    return (
        <Fragment>
            <div className="flex justify-between items-center">
                <p className="font-semibold text-xl">Custom Test</p>
                <div
                    onClick={() => {
                        setOpenModalSetting(true);
                        setItemSelect(null);
                    }}
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
                            <div className="flex items-center gap-2">
                                <div
                                    onClick={() => {
                                        handleOpenModalSetting(item);
                                    }}
                                    className="w-6 h-6 rounded flex cursor-pointer items-center justify-center bg-[#2121210F]"
                                >
                                    <IconEdit />
                                </div>
                                <div
                                    onClick={() => {
                                        handleOpenModalDelete(item);
                                    }}
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
                        <MtUiButton block onClick={handleDelete}>
                            Ok
                        </MtUiButton>
                        <MtUiButton type="primary" block onClick={handleClose}>
                            Cancel
                        </MtUiButton>
                    </div>
                </div>
            </Dialog>
            {openModalSetting && (
                <ModalSettingCustomTest
                    item={itemSelect}
                    isShowBtnCancel={listTest?.length > 0}
                    open={openModalSetting}
                    onClose={onClose}
                />
            )}
        </Fragment>
    );
};

export default GridLeftCustomTest;

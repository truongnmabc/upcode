"use client";
import { MtUiButton } from "@/components/button";
import { db } from "@/db/db.model";
import { ITestQuestion } from "@/models/tests/testQuestions";
import { gameState } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { Fragment, useEffect, useState } from "react";
import ModalSettingCustomTest from "../modalSetting";
import { IconDelete, IconEdit, IconPlus } from "./iconGridLeft";
import choiceStartCustomTestThunk from "@/redux/repository/game/customTest/choiceStartTest";
import { Modal } from "@mui/material";
import ModalDeleteTsx from "../modalDelete.tsx";
import { useIsMobile } from "@/hooks/useIsMobile";
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
        if (listQuestion?.length) handleGetData();

        return () => {
            setOpenModalSetting(false);
        };
    }, [listQuestion?.length]);

    useEffect(() => {
        if (listQuestion?.length === 0) {
            setOpenModalSetting(true);
        }
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

    const dispatch = useAppDispatch();

    const handleClickChoiceTest = (item: ITestQuestion) => {
        dispatch(choiceStartCustomTestThunk({ item }));
    };
    const isMobile = useIsMobile();
    return (
        <Fragment>
            {!isMobile && (
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
                                    <p
                                        className="text-sm cursor-pointer font-medium"
                                        onClick={() => {
                                            handleClickChoiceTest(item);
                                        }}
                                    >
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
                </Fragment>
            )}
            {openDelete && (
                <ModalDeleteTsx
                    openDelete={openDelete}
                    handleClose={handleClose}
                    handleDelete={handleDelete}
                />
            )}
            {openModalSetting && (
                <ModalSettingCustomTest
                    item={itemSelect}
                    isShowBtnCancel={
                        listTest?.length > 0 || listQuestion?.length > 0
                    }
                    open={openModalSetting}
                    onClose={onClose}
                />
            )}
        </Fragment>
    );
};

export default React.memo(GridLeftCustomTest);

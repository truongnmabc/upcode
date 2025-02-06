"use client";
import { db } from "@/db/db.model";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ITestBase } from "@/models/tests";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import choiceStartCustomTestThunk from "@/redux/repository/game/choiceAnswer/choiceStartTest";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import ModalSettingCustomTest from "../modalSetting";
import { IconDelete, IconEdit, IconPlus } from "@/components/icon/iconGridLeft";
import ModalDelete from "../modalDelete";
import {
    selectCurrentSubTopicIndex,
    selectIsDataLoaded,
    selectListQuestion,
} from "@/redux/features/game.reselect";
import { resetState, startCustomTest } from "@/redux/features/game";
import clsx from "clsx";
const GridLeftCustomTest = () => {
    const [listTest, setListTest] = useState<ITestBase[]>([]);
    const [openModalSetting, setOpenModalSetting] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [itemSelect, setItemSelect] = useState<ITestBase | null>(null);
    const listQuestion = useAppSelector(selectListQuestion);
    const dispatch = useAppDispatch();
    const indexSubTopic = useAppSelector(selectCurrentSubTopicIndex);
    const isDataLoaded = useAppSelector(selectIsDataLoaded);

    const isMobile = useIsMobile();
    const handleGetData = useCallback(async () => {
        const list = await db?.testQuestions
            .where("gameMode")
            .equals("customTets")
            .toArray();

        if (list?.length === 0) {
            setOpenModalSetting(true);
        }
        if (list) {
            setListTest(list);
        }
    }, []);
    useEffect(() => {
        if (listQuestion?.length) handleGetData();

        if (listQuestion?.length === 0 && isDataLoaded) {
            setOpenModalSetting(true);
        }
        return () => {
            setOpenModalSetting(false);
        };
    }, [listQuestion?.length, isDataLoaded, handleGetData]);

    const onClose = useCallback(() => {
        setOpenModalSetting(false);
        setItemSelect(null);
    }, []);

    const handleOpenModalSetting = useCallback((e: ITestBase) => {
        setOpenModalSetting(true);
        setItemSelect(e);
    }, []);

    const handleOpenModalDelete = useCallback((e: ITestBase) => {
        setItemSelect(e);
        setOpenDelete(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpenDelete(false);
    }, []);

    const handleDelete = useCallback(async () => {
        if (itemSelect) {
            await db?.testQuestions.where("id").equals(itemSelect?.id).delete();

            const startTest = await db?.testQuestions
                .where("gameMode")
                .equals("customTets")
                .filter((item) => item.status === 0)
                .first();

            setListTest((prev) => {
                const updatedList = prev.filter(
                    (item) => item.id !== itemSelect.id
                );
                if (updatedList.length === 0) {
                    setItemSelect(null);
                    dispatch(resetState());
                }
                return updatedList;
            });
            if (startTest) {
                const listIds = startTest.groupExamData.flatMap(
                    (i) => i.questionIds
                );

                const questions = await db?.questions
                    .where("id")
                    .anyOf(listIds)
                    .toArray();

                dispatch(
                    startCustomTest({
                        listQuestion: questions,
                        totalDuration: startTest?.totalDuration * 60,
                        parentId: startTest.id,
                        passingThreshold: startTest.passingThreshold,
                        gameDifficultyLevel: startTest.gameDifficultyLevel,
                        indexSubTopic: 1,
                    })
                );
            }

            setOpenDelete(false);
        }
    }, [itemSelect, dispatch]);

    const handleClickChoiceTest = useCallback(
        (item: ITestBase, index: number) => {
            dispatch(
                choiceStartCustomTestThunk({
                    item: {
                        ...item,
                        indexSubTopic: index,
                    },
                })
            );
        },
        [dispatch]
    );

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
                                    className={clsx(
                                        "flex bg-[#2121210A]  hover:border-primary border border-solid rounded-lg px-3 py-[10px] gap-2 justify-between items-center",
                                        {
                                            "border-primary":
                                                indexSubTopic - 1 === index,
                                        }
                                    )}
                                >
                                    <p
                                        className="text-sm cursor-pointer font-medium"
                                        onClick={() => {
                                            handleClickChoiceTest(
                                                item,
                                                index + 1
                                            );
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
                <ModalDelete
                    openDelete={openDelete}
                    handleClose={handleClose}
                    handleDelete={handleDelete}
                />
            )}
            {openModalSetting ? (
                <ModalSettingCustomTest
                    item={itemSelect}
                    isShowBtnCancel={
                        listTest?.length > 0 || listQuestion?.length > 0
                    }
                    open={openModalSetting}
                    onClose={onClose}
                    listTestLength={listTest?.length}
                />
            ) : null}
        </Fragment>
    );
};

export default React.memo(GridLeftCustomTest);

import { TypeParam } from "@/constants";
import RouterApp from "@/router/router.constant";
import MtUiRipple, { useRipple } from "@/components/ripple";
import { db } from "@/db/db.model";
import { resetState } from "@/redux/features/game";
import { useAppDispatch } from "@/redux/hooks";
import initCustomTestThunk from "@/redux/repository/game/initData/initCustomTest";
import initDiagnosticTestQuestionThunk from "@/redux/repository/game/initData/initDiagnosticTest";
import initFinalTestThunk from "@/redux/repository/game/initData/initFinalTest";
import initTestQuestionThunk from "@/redux/repository/game/initData/initPracticeTest";
import { revertPathName } from "@/utils/pathName";
import { Grid2 } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { IPropsItemTest } from "../type";

const ItemGridTest: React.FC<IPropsItemTest> = ({ item, appInfo }) => {
    const [open, setOpen] = React.useState(false);
    const isMobile = useIsMobile();
    const router = useRouter();
    const {
        ripples,
        onClick: onRippleClickHandler,
        onClear: onClearRipple,
    } = useRipple();

    const dispatch = useAppDispatch();
    const handleCustomTest = useCallback(async () => {
        dispatch(initCustomTestThunk());

        const _href = revertPathName({
            href: "custom_test",
            appName: appInfo.appShortName,
        });
        await router.push(_href);
    }, [dispatch, appInfo.appShortName, router]);

    const handleFinalTest = useCallback(async () => {
        dispatch(initFinalTestThunk());

        const _href = revertPathName({
            href: RouterApp.Final_test,
            appName: appInfo.appShortName,
        });
        await router.push(_href);
    }, [dispatch, appInfo.appShortName, router]);

    const handleDiagnosticTest = useCallback(async () => {
        dispatch(initDiagnosticTestQuestionThunk());
        const _href = revertPathName({
            href: RouterApp.Diagnostic_test,
            appName: appInfo.appShortName,
        });
        await router.push(_href);
    }, [dispatch, appInfo.appShortName, router]);

    const handlePracticeTest = useCallback(async () => {
        const res = await db?.testQuestions
            .where("type")
            .equals("practiceTests")
            .toArray();
        if (res) {
            const currentTest = res.find((item) => item?.status === 0);
            if (currentTest && currentTest?.id) {
                const id = currentTest?.parentId;
                dispatch(
                    initTestQuestionThunk({
                        testId: id,
                        duration: currentTest?.duration,
                    })
                );

                const _href = revertPathName({
                    href: `/study/${TypeParam.practiceTest}?type=test&testId=${id}`,
                    appName: appInfo.appShortName,
                });
                await router.push(_href);
            }
        }
    }, [dispatch, appInfo.appShortName, router]);

    const handleClick: React.MouseEventHandler<HTMLDivElement> = useCallback(
        (e) => {
            onRippleClickHandler(e);
            dispatch(resetState());
            switch (item.id) {
                case "CT":
                    handleCustomTest();
                    break;
                case "FT":
                    handleFinalTest();
                    break;
                case "DT":
                    handleDiagnosticTest();
                    break;
                case "PT":
                    if (isMobile) return setOpen(!open);
                    handlePracticeTest();
                    break;
                default:
                    break;
            }
        },
        [
            item.id,
            dispatch,
            handleCustomTest,
            handleFinalTest,
            handleDiagnosticTest,
            handlePracticeTest,
            onRippleClickHandler,
            isMobile,
            open,
        ]
    );

    return (
        <Fragment>
            <Grid2
                size={{
                    xs: 12,
                    sm: 6,
                    md: 6,
                    lg: 3,
                }}
            >
                <div
                    className="flex border p-2 relative hover:border-primary overflow-hidden bg-white cursor-pointer w-full h-[52px] sm:h-[72px] rounded-md"
                    onClick={handleClick}
                >
                    <div
                        className="h-full aspect-square    rounded-md flex  items-center justify-center rounded-tl-md"
                        style={{
                            backgroundColor: item.color,
                        }}
                    >
                        <div className="w-5 h-5 sm:w-8 sm:h-8">{item.icon}</div>
                    </div>
                    <h3 className="pl-4 flex-1 text-base sm:text-lg  flex items-center justify-start font-medium ">
                        {item.name}
                    </h3>
                    <MtUiRipple ripples={ripples} onClear={onClearRipple} />
                </div>
            </Grid2>
            {item.id === "PT" && <ListPracticeTest open={open} />}
        </Fragment>
    );
};

export default ItemGridTest;

import Collapse from "@mui/material/Collapse";
import ItemTestLeft from "@/components/gridTests/itemTest";
import { useIsMobile } from "@/hooks/useIsMobile";

type IListTest = {
    parentId: number;
    duration: number;
};

const ListPracticeTest = ({ open }: { open: boolean }) => {
    const [listPracticeTests, setListPracticeTests] = useState<IListTest[]>([]);

    const handleGetData = useCallback(async () => {
        const listData = await db?.testQuestions
            .filter((test) => test.type === "practiceTests")
            .toArray();
        if (listData) {
            setListPracticeTests(
                listData?.map((item) => ({
                    duration: item.duration,
                    parentId: item.parentId,
                }))
            );
        }
    }, []);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);
    return (
        <Collapse in={open} timeout="auto" unmountOnExit className="w-full">
            <div className="w-full flex  flex-col gap-2">
                {listPracticeTests?.map((test, index) => (
                    <ItemTestLeft key={index} index={index} test={test} />
                ))}
            </div>
        </Collapse>
    );
};

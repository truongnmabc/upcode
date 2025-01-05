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
import React, { useCallback } from "react";
import { IPropsItemTest } from "../type";

const ItemGridTest: React.FC<IPropsItemTest> = ({ item, appInfo }) => {
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
        ]
    );

    return (
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
                <div className="h-full aspect-square bg-primary-16   rounded-md flex  items-center justify-center rounded-tl-md">
                    <div className="w-5 h-5 sm:w-8 sm:h-8">{item.icon}</div>
                </div>
                <h3 className="pl-4 flex-1 text-xs sm:text-lg  flex items-center justify-start font-medium ">
                    {item.name}
                </h3>
                <MtUiRipple ripples={ripples} onClear={onClearRipple} />
            </div>
        </Grid2>
    );
};

export default ItemGridTest;

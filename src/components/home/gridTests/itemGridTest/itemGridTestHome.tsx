import MtUiRipple, { useRipple } from "@/components/ripple";
import { db } from "@/db/db.model";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initTestQuestionThunk from "@/redux/repository/game/initData/initPracticeTest";
import { revertPathName } from "@/utils/pathName";
import { Grid2 } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { IPropsItemTest } from "../type";
import RouterApp from "@/common/router/router.constant";
import initDiagnosticTestQuestionThunk from "@/redux/repository/game/initData/initDiagnosticTest";
import initFinalTestThunk from "@/redux/repository/game/initData/initFinalTest";
import initCustomTestThunk from "@/redux/repository/game/initData/initCustomTest";
import { resetState } from "@/redux/features/game";
import { TypeParam } from "@/common/constants";

const ItemGridTest: React.FC<IPropsItemTest> = ({ item }) => {
    const router = useRouter();
    const {
        ripples,
        onClick: onRippleClickHandler,
        onClear: onClearRipple,
    } = useRipple();
    const { appInfo } = useAppSelector(appInfoState);
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
    }, [dispatch, item.name, appInfo.appShortName, router]);

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
            handleCustomTest,
            handleFinalTest,
            handleDiagnosticTest,
            handlePracticeTest,
            onRippleClickHandler,
        ]
    );
    const _href = revertPathName({
        href: `/study/${item.name}?type=test&testId=${1}`,
        appName: appInfo.appShortName,
    });
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
                className="flex border relative overflow-hidden bg-white cursor-pointer w-full h-[52px] sm:h-[72px] rounded-md"
                onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = item?.color || "";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "";
                }}
                onClick={handleClick}
            >
                <div
                    style={{
                        backgroundColor: item.color,
                    }}
                    className="w-[52px] h-[52px] sm:w-[72px] sm:h-[72px] rounded-bl-md flex  items-center justify-center rounded-tl-md"
                >
                    <div className="w-6  h-6 sm:w8 sm:h-8">{item.icon}</div>
                </div>
                <h3 className="pl-4 flex-1 text-base sm:text-lg  flex items-center justify-start font-medium ">
                    {item.name}
                </h3>
                <MtUiRipple ripples={ripples} onClear={onClearRipple} />
            </div>
        </Grid2>
    );
};

export default ItemGridTest;

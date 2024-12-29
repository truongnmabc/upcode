"use client";
import CloseIcon from "@/asset/icon/CloseIcon";
import { MtUiButton } from "@/components/button";
import MyContainer from "@/components/container/myContainer";
import { IconFailResultTest } from "../icon/iconFailResultTest";
import { IconPassResultTest } from "../icon/iconPassResultTest";

import { TypeParam } from "@/common/constants";
import RouterApp from "@/common/router/router.constant";
import { handleNavigateStudy } from "@/components/home/gridTopic/item/titleTopic";
import { db } from "@/db/db.model";
import { appInfoState } from "@/redux/features/appInfo";
import { gameState, startOverGame } from "@/redux/features/game";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initCustomTestThunk from "@/redux/repository/game/initData/initCustomTest";
import initFinalTestThunk from "@/redux/repository/game/initData/initFinalTest";
import initPracticeThunk from "@/redux/repository/game/initData/initPracticeTest";
import { revertPathName } from "@/utils/pathName";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useCallback, useEffect, useState } from "react";
import DashboardCard from "./chartHeader";

const HeaderResultTest = () => {
    const router = useRouter();
    const { idTopic, passing, listQuestion } = useAppSelector(gameState);
    const { appInfo } = useAppSelector(appInfoState);
    const type = useSearchParams().get("type");
    const dispatch = useAppDispatch();
    const [info, setInfo] = useState({
        pass: 0,
        percent: 0,
        isPass: false,
    });

    const handleGetData = async () => {
        if (idTopic && passing) {
            const data = await db?.userProgress
                .where("parentId")
                .equals(idTopic)
                .toArray();

            const listPass = data?.filter((item) =>
                item.selectedAnswers?.find((item) => item.correct)
            );

            if (listPass && listPass?.length) {
                const percent = Math.floor(
                    (listPass?.length / listQuestion?.length) * 100
                );
                setInfo({
                    pass: listPass?.length || 0,
                    percent: percent,
                    isPass: percent >= passing,
                });
            }
        }
    };

    useEffect(() => {
        handleGetData();
    }, [idTopic, passing, listQuestion]);

    const handleTryAgain = useCallback(async () => {
        if (type === TypeParam.diagnosticTest) {
            dispatch(startOverGame());
            const _href = revertPathName({
                appName: appInfo.appShortName,
                href: RouterApp.Diagnostic_test,
            });
            return router.replace(_href);
        }
        if (type === TypeParam.finalTest) {
            dispatch(initFinalTestThunk());
            const _href = revertPathName({
                appName: appInfo.appShortName,
                href: RouterApp.Final_test,
            });
            return router.replace(_href);
        }

        if (type === TypeParam.practiceTest) {
            dispatch(startOverGame());
            const _href = revertPathName({
                appName: appInfo.appShortName,
                href: `study/${TypeParam.practiceTest}?type=test&testId=${idTopic}`,
            });
            return router.replace(_href);
        }
    }, [router, appInfo, idTopic]);

    const handleNextTets = useCallback(async () => {
        if (type === TypeParam.practiceTest) {
            const currentTest = await db?.testQuestions
                .where("type")
                .equals("practiceTests")
                .filter((item) => item.status === 0)
                .first();

            dispatch(initPracticeThunk({}));
            const _href = revertPathName({
                appName: appInfo.appShortName,
                href: `study/${TypeParam.practiceTest}?type=test&testId=${currentTest?.parentId}`,
            });
            return router.replace(_href);
        }
        if (type === TypeParam.customTest) {
            dispatch(initCustomTestThunk());
            const _href = revertPathName({
                appName: appInfo.appShortName,
                href: RouterApp.Custom_test,
            });
            return router.push(_href);
        }
    }, [router, appInfo, type]);

    const handleStartLearning = useCallback(async () => {
        const listTopic = await db?.topics.toArray();
        if (listTopic?.length) {
            handleNavigateStudy({
                dispatch,
                router,
                appShortName: appInfo.appShortName,
                topic: listTopic[0],
                isReplace: true,
            });
        }
    }, [dispatch, router, appInfo.appShortName]);

    return (
        <MyContainer className="py-8 flex gap-8">
            <div
                className="w-10 h-10 rounded-full cursor-pointer bg-white flex items-center justify-center"
                onClick={() => router.back()}
            >
                <CloseIcon />
            </div>
            <div className="flex-1 flex gap-10 items-end">
                <div className="w-[234px] h-[232px]">
                    {info.isPass ? (
                        <IconPassResultTest />
                    ) : (
                        <IconFailResultTest />
                    )}
                </div>
                <div className="flex-1 flex flex-col gap-6 overflow-hidden justify-between h-full pt-16">
                    <div className="flex-1">
                        {info.isPass ? <TitlePass /> : <TitleMiss />}
                    </div>
                    <div className="flex gap-6 items-center">
                        <MtUiButton
                            className="py-4 max-h-14 text-lg font-medium rounded-2xl text-primary border-primary"
                            block
                            size="large"
                            onClick={handleTryAgain}
                        >
                            Try Again
                        </MtUiButton>
                        {(type === TypeParam.practiceTest ||
                            type === TypeParam.customTest) && (
                            <MtUiButton
                                className="py-4 max-h-14 text-lg font-medium rounded-2xl "
                                block
                                type="primary"
                                size="large"
                                onClick={handleNextTets}
                            >
                                Next Test
                            </MtUiButton>
                        )}
                        {type === TypeParam.diagnosticTest && (
                            <MtUiButton
                                className="py-4 max-h-14 text-lg font-medium rounded-2xl "
                                block
                                type="primary"
                                size="large"
                                onClick={handleStartLearning}
                            >
                                Start Learning
                            </MtUiButton>
                        )}
                    </div>
                </div>
                <DashboardCard
                    info={{
                        pass: info.pass,
                        total: listQuestion.length,
                        percent: info.percent,
                    }}
                />
            </div>
        </MyContainer>
    );
};

export default HeaderResultTest;

const TitlePass = () => {
    return (
        <Fragment>
            <p className="text-[#15CB9F] text-[42px] leading-[62px] font-semibold">
                Excellent performance!
            </p>
            <p className="text-base mt-3 font-normal text-[#21212185]">
                That was a tough one, but every wrong answer is a stepping stone
                to the right one. Keep at it, and you&apos;ll be a knowledge
                ninja soon!
            </p>
        </Fragment>
    );
};

const TitleMiss = () => {
    return (
        <Fragment>
            <p className="text-[#EF4444] text-[42px] leading-[62px] font-semibold">
                Not enough to pass!
            </p>
            <p className="text-base mt-3 font-normal text-[#21212185]">
                Do not rest on your laurels, friend. Time to leaf through the
                rest of these tests and make them tremble with your intellect!
            </p>
        </Fragment>
    );
};

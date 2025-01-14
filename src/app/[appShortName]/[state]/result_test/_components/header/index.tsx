"use client";
import CloseIcon from "@/asset/icon/CloseIcon";
import { MtUiButton } from "@/components/button";
import MyContainer from "@/components/container";
import { handleNavigateStudy } from "@/components/home/gridTopic/item/titleTopic";
import { TypeParam } from "@/constants";
import { db } from "@/db/db.model";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import {
    setTurtGame,
    startOverGame,
    startTryAgainDiagnostic,
} from "@/redux/features/game";
import {
    selectIdTopic,
    selectListQuestion,
    selectTurn,
} from "@/redux/features/game.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initCustomTestThunk from "@/redux/repository/game/initData/initCustomTest";
import initFinalTestThunk from "@/redux/repository/game/initData/initFinalTest";
import initPracticeThunk from "@/redux/repository/game/initData/initPracticeTest";
import RouterApp from "@/router/router.constant";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";
import { IconFailResultTest } from "../icon/iconFailResultTest";
import { IconPassResultTest } from "../icon/iconPassResultTest";
import DashboardCard from "./chartHeader";
import HeaderResultDiagnostic from "./headerResultDiagnostic";
import { TitleMiss, TitlePass } from "./titleResultTest";

type IProps = {
    pass: number;
    percent: number;
    isPass: boolean;
};
const HeaderResultTest: React.FC<IProps> = (info) => {
    const router = useRouter();
    const idTopic = useAppSelector(selectIdTopic);
    const listQuestion = useAppSelector(selectListQuestion);
    const appInfo = useAppSelector(selectAppInfo);
    const turn = useAppSelector(selectTurn);
    const type = useSearchParams().get("type");
    const dispatch = useAppDispatch();

    const handleTryAgain = useCallback(async () => {
        let _href = "";
        switch (type) {
            case TypeParam.diagnosticTest:
                dispatch(startTryAgainDiagnostic());
                _href = RouterApp.Diagnostic_test;
                break;

            case TypeParam.finalTest:
                dispatch(initFinalTestThunk());
                _href = RouterApp.Final_test;
                break;

            case TypeParam.practiceTest:
                dispatch(startOverGame());
                dispatch(
                    setTurtGame({
                        turn: turn + 1,
                    })
                );
                _href = `/study/${TypeParam.practiceTest}?type=test&testId=${idTopic}`;
                break;

            case TypeParam.review:
                _href = RouterApp.Review;
                break;

            default:
                return;
        }

        if (_href) {
            router.replace(_href);
        }
    }, [router, idTopic, dispatch, type, turn]);

    const handleNextTets = useCallback(async () => {
        if (type === TypeParam.practiceTest) {
            const currentTest = await db?.testQuestions
                .where("type")
                .equals("practiceTests")
                .filter((item) => item.status === 0)
                .first();

            dispatch(initPracticeThunk({}));
            const _href = `/study/${TypeParam.practiceTest}?type=test&testId=${currentTest?.parentId}`;
            return router.replace(_href);
        }
        if (type === TypeParam.customTest) {
            dispatch(initCustomTestThunk());

            return router.push(RouterApp.Custom_test);
        }
    }, [router, type, dispatch]);

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

    const back = useCallback(() => router.back(), [router]);

    if (type === TypeParam.diagnosticTest) {
        return (
            <HeaderResultDiagnostic
                handleStartLearning={handleStartLearning}
                handleTryAgain={handleTryAgain}
                percentage={info.percent}
            />
        );
    }
    return (
        <MyContainer className="py-8 flex flex-col sm:flex-row gap-8">
            <div
                className="w-10 h-10 rounded-full cursor-pointer bg-white flex items-center justify-center"
                onClick={back}
            >
                <CloseIcon />
            </div>
            <div className="flex-1 flex flex-col sm:flex-row gap-3 sm:gap-10 items-end">
                <div className="w-full flex justify-center sm:w-[234px] sm:h-[232px]">
                    {info.isPass ? (
                        <IconPassResultTest />
                    ) : (
                        <IconFailResultTest />
                    )}
                </div>
                <div className="flex-1 flex flex-col gap-6 overflow-hidden justify-between h-full sm:pt-16">
                    <div className="flex-1">
                        {info.isPass ? <TitlePass /> : <TitleMiss />}
                    </div>
                    <div className="flex gap-6 items-center">
                        <MtUiButton
                            className="sm:py-4 sm:max-h-14 text-lg font-medium rounded-2xl text-primary border-primary"
                            block
                            size="large"
                            onClick={handleTryAgain}
                        >
                            Try Again
                        </MtUiButton>
                        {(type === TypeParam.practiceTest ||
                            type === TypeParam.customTest) && (
                            <MtUiButton
                                className="sm:py-4 sm:max-h-14 text-lg font-medium rounded-2xl "
                                block
                                type="primary"
                                size="large"
                                onClick={handleNextTets}
                            >
                                Next Test
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

export default React.memo(HeaderResultTest);

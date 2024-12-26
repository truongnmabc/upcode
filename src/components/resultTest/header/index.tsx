"use client";
import CloseIcon from "@/asset/icon/CloseIcon";
import { MtUiButton } from "@/components/button";
import MyContainer from "@/components/container/myContainer";
import { IconPassResultTest } from "../icon/iconPassResultTest";
import DashboardCard from "./chartHeader";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { gameState } from "@/redux/features/game";
import { Fragment, useEffect, useLayoutEffect, useState } from "react";
import { db } from "@/db/db.model";
import { IconFailResultTest } from "../icon/iconFailResultTest";

const HeaderResultTest = () => {
    const router = useRouter();

    const { idTopic, turn, passing, listQuestion } = useAppSelector(gameState);

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

    useLayoutEffect(() => {
        handleGetData();
    }, [idTopic, passing, listQuestion]);
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
                        >
                            Try Again
                        </MtUiButton>
                        <MtUiButton
                            className="py-4 max-h-14 text-lg font-medium rounded-2xl "
                            block
                            type="primary"
                            size="large"
                        >
                            Next Test
                        </MtUiButton>
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

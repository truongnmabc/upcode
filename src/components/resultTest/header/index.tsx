"use client";
import React from "react";
import CloseIcon from "@/asset/icon/CloseIcon";
import MyContainer from "@/components/v4-material/myContainer";
import { IconPassResultTest } from "../icon/iconPassResultTest";
import { MtUiButton } from "@/components/button";
import DashboardCard from "./chartHeader";
import { useAppSelector } from "@/redux/hooks";
import { gameState } from "@/redux/features/game";

const HeaderResultTest = () => {
    return (
        <MyContainer className="py-8 flex gap-8">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <CloseIcon />
            </div>
            <div className="flex-1 flex gap-10 items-end">
                <div className="w-[234px] h-[232px]">
                    <IconPassResultTest />
                </div>
                <div className="flex-1 flex flex-col gap-6 overflow-hidden justify-between h-full pt-16">
                    <div className="flex-1">
                        <p className="text-[#EF4444] text-[42px] leading-[62px] font-semibold">
                            Not enough to pass!
                        </p>
                        <p className="text-base mt-3 font-normal text-[#21212185]">
                            That was a tough one, but every wrong answer is a
                            stepping stone to the right one. Keep at it, and
                            you'll be a knowledge ninja soon!
                        </p>
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
                <DashboardCard />
            </div>
        </MyContainer>
    );
};

export default HeaderResultTest;

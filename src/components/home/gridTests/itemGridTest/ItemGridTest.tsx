import MtUiRipple, { useRipple } from "@/components/ripple";
import { db } from "@/db/db.model";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import initTestQuestionThunk from "@/redux/repository/game/initTestQuestion";
import { revertPathName } from "@/utils/pathName";
import { Grid2 } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { IPropsItemTest } from "../type";

const ItemGridTest: React.FC<IPropsItemTest> = ({ item }) => {
    const router = useRouter();
    const {
        ripples,
        onClick: onRippleClickHandler,
        onClear: onClearRipple,
    } = useRipple();
    const { appInfo } = useAppSelector(appInfoState);
    const dispatch = useAppDispatch();
    const handleClick: React.MouseEventHandler<HTMLDivElement> = useCallback(
        async (e) => {
            onRippleClickHandler(e);

            if (item.id === "CT") {
                const _href = revertPathName({
                    href: "custom_test",
                    appName: appInfo.appShortName,
                });
                router.push(_href);
                return;
            }

            if (item.id === "FT") {
                const _href = revertPathName({
                    href: `/final_test/full-length-${appInfo?.appShortName}-practice-test`,
                    appName: appInfo.appShortName,
                });
                router.push(_href);
                return;
            }

            if (item.id === "DT") {
                // const res = await db.tests.where("type").equals("diagnosticTestFormat").toArray();
                // const _href = revertPathName({
                //     href: `/study/${item.name}?type=test&testId=${id}`,
                //     appName: appInfo.appShortName,
                // });
                // router.push(_href);
            }
            if (item.id === "PT") {
                const res = await db?.tests
                    .where("testType")
                    .equals("practiceTests")
                    .toArray();
                if (res) {
                    const currentTest = res.find((item) => item?.status === 0);
                    const id = currentTest?.id.toString();
                    dispatch(
                        initTestQuestionThunk({
                            testId: id,
                            duration: currentTest?.duration,
                        })
                    );

                    const _href = revertPathName({
                        href: `/study/${item.name}?type=test&testId=${id}`,
                        appName: appInfo.appShortName,
                    });
                    router.push(_href);
                }
            }
        },
        [
            appInfo.appShortName,
            dispatch,
            item.id,
            item.name,
            onRippleClickHandler,
            router,
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
                className="flex border relative overflow-hidden cursor-pointer w-full h-[52px] sm:h-[72px] rounded-md"
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

"use client";
import RouterApp from "@/router/router.constant";
import { MtUiButton } from "@/components/button";
import { appInfoState } from "@/redux/features/appInfo";
import { endTest } from "@/redux/features/game";
import { selectListQuestion } from "@/redux/features/game.reselect";
import { shouldOpenSubmitTest, testState } from "@/redux/features/tests";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishCustomTestThunk from "@/redux/repository/game/finish/finishCustomTest";
import finishDiagnosticThunk from "@/redux/repository/game/finish/finishDiagnostic";
import finishFinalThunk from "@/redux/repository/game/finish/finishFinal";
import finishPracticeThunk from "@/redux/repository/game/finish/finishPracticeTest";
import { revertPathName } from "@/utils/pathName";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Dialog } from "@mui/material";
const Sheet = dynamic(() => import("@/components/sheet"), {
    ssr: false,
});

enum TestType {
    Diagnostic = "diagnostic_test",
    Final = "final_test",
    Custom = "custom_test",
}

const actionMap = {
    [TestType.Diagnostic]: finishDiagnosticThunk,
    [TestType.Final]: finishFinalThunk,
    [TestType.Custom]: finishCustomTestThunk,
};

const BottomConfirmTest = () => {
    const { openSubmit } = useAppSelector(testState);
    const dispatch = useAppDispatch();
    const isMobile = useIsMobile();
    const { appInfo } = useAppSelector(appInfoState);
    const pathname = usePathname();
    const listQuestions = useAppSelector(selectListQuestion);
    const router = useRouter();
    const type = useSearchParams().get("type");
    const [info, setInfo] = useState({
        answer: 0,
        total: 0,
    });

    const setOpenConfirm = useCallback(
        () => dispatch(shouldOpenSubmitTest(false)),
        [dispatch]
    );

    useEffect(() => {
        if (listQuestions) {
            setInfo({
                answer: listQuestions.filter((item) => item.selectedAnswer)
                    .length,
                total: listQuestions.length,
            });
        }
    }, [listQuestions]);

    const handleConfirm = useCallback(() => {
        const testType = Object.values(TestType).find((key) =>
            pathname?.includes(key)
        );

        if (testType) {
            dispatch(actionMap[testType]());
        } else if (type === "test") {
            dispatch(finishPracticeThunk());
        }

        const segments = pathname.split("/").filter(Boolean);

        const lastSegment = segments[segments.length - 1];
        const _href = revertPathName({
            href: `${RouterApp.ResultTest}?type=${lastSegment}`,
            appName: appInfo.appShortName,
        });

        dispatch(shouldOpenSubmitTest(false));
        dispatch(endTest());

        router.replace(_href);
    }, [dispatch, appInfo.appShortName, router, pathname, type]);

    if (isMobile) {
        return (
            <Dialog open={openSubmit} onClose={setOpenConfirm}>
                <Content
                    handleConfirm={handleConfirm}
                    setOpenConfirm={setOpenConfirm}
                    info={info}
                />
            </Dialog>
        );
    }
    return (
        <div className="zaui-sheet-content-border-none">
            <Sheet
                mask
                maskClosable
                visible={openSubmit}
                onClose={setOpenConfirm}
                autoHeight
                unmountOnClose
                handler={false}
            >
                <Content
                    handleConfirm={handleConfirm}
                    setOpenConfirm={setOpenConfirm}
                    info={info}
                />
            </Sheet>
        </div>
    );
};

export default React.memo(BottomConfirmTest);

const Content = ({
    info,
    setOpenConfirm,
    handleConfirm,
}: {
    setOpenConfirm: () => void;
    handleConfirm: () => void;
    info: {
        answer: number;
        total: number;
    };
}) => {
    return (
        <div className="w-full p-3 gap-2 sm:p-0  sm:px-20 sm:py-6 bg-[#F9F7EE] flex items-center flex-col sm:flex-row justify-between">
            <div className="w-full">
                {info.answer !== info.total && (
                    <p className="text-base text-center sm:text-start sm:text-2xl font-medium">
                        You answered {info.answer} out of {info.total} questions
                        on this test.
                    </p>
                )}
                <p className="text-sm text-[#21212185] sm:text-base font-normal">
                    Are you sure you want to submit the test?
                </p>
            </div>
            <div className="flex gap-6 items-center">
                <MtUiButton
                    className="text-base px-10"
                    onClick={setOpenConfirm}
                >
                    Cancel
                </MtUiButton>
                <MtUiButton
                    type="primary"
                    className="text-base px-10"
                    onClick={handleConfirm}
                >
                    Submit
                </MtUiButton>
            </div>
        </div>
    );
};

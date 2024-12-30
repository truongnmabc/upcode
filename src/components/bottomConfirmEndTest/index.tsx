"use client";
import RouterApp from "@/common/router/router.constant";
import { MtUiButton } from "@/components/button";
import { appInfoState } from "@/redux/features/appInfo";
import { endTest } from "@/redux/features/game";
import { shouldOpenSubmitTest, testState } from "@/redux/features/tests";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishCustomTestThunk from "@/redux/repository/game/finish/finishCustomTest";
import finishDiagnosticThunk from "@/redux/repository/game/finish/finishDiagnostic";
import finishFinalThunk from "@/redux/repository/game/finish/finishFinal";
import finishPracticeThunk from "@/redux/repository/game/finish/finishPracticeTest";
import { revertPathName } from "@/utils/pathName";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";
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
    const setOpenConfirm = () => dispatch(shouldOpenSubmitTest(false));
    const { appInfo } = useAppSelector(appInfoState);
    const pathname = usePathname();

    const router = useRouter();
    const type = useSearchParams().get("type");

    const handleConfirm = useCallback(() => {
        console.log("Start handleConfirm:", new Date().toISOString());

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

        console.log("End handleConfirm:", new Date().toISOString());

        router.replace(_href);
    }, [dispatch, appInfo.appShortName, router, pathname, type]);

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
                <div className="w-full  px-20 py-6 bg-[#F9F7EE] flex items-center justify-between">
                    <div>
                        <p className="text-2xl font-medium">
                            Do you really want to exit?
                        </p>
                        <p className="text-[#21212185] text-base font-normal">
                            Or submit to explore your strong/weak topics.
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
            </Sheet>
        </div>
    );
};

export default React.memo(BottomConfirmTest);

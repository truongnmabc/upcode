"use client";
import RouterApp from "@/common/router/router.constant";
import { MtUiButton } from "@/components/button";
import Sheet from "@/components/sheet";
import { appInfoState } from "@/redux/features/appInfo";
import { endTest } from "@/redux/features/game";
import { shouldOpenSubmitTest, testState } from "@/redux/features/tests";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import finishDiagnosticThunk from "@/redux/repository/game/finish/finishDiagnostic";
import { revertPathName } from "@/utils/pathName";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback } from "react";

const BottomConfigTest = () => {
    const { openSubmit } = useAppSelector(testState);
    const dispatch = useAppDispatch();
    const setOpenConfirm = () => dispatch(shouldOpenSubmitTest(false));
    const { appInfo } = useAppSelector(appInfoState);
    const pathname = usePathname();

    const router = useRouter();

    const handleConfirm = useCallback(() => {
        if (pathname?.includes("diagnostic_test")) {
            dispatch(finishDiagnosticThunk());
        }

        const _href = revertPathName({
            href: RouterApp.ResultTest,
            appName: appInfo.appShortName,
        });

        dispatch(shouldOpenSubmitTest(false));
        dispatch(endTest());
        router.replace(_href);
    }, [RouterApp, dispatch, appInfo.appShortName, router, pathname]);

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

export default BottomConfigTest;

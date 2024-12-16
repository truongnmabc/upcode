"use client";
import { MtUiButton } from "@/components/button";
import Sheet from "@/components/sheet";
import { shouldOpenSubmitTest, TestState } from "@/redux/features/tests";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React from "react";

const BottomConfigTest = () => {
    const { openSubmit } = useAppSelector(TestState);
    const dispatch = useAppDispatch();
    const setOpenConfirm = () => {
        dispatch(shouldOpenSubmitTest(false));
    };
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
                        <MtUiButton className="text-base px-10">
                            Exit
                        </MtUiButton>
                        <MtUiButton type="primary" className="text-base px-10">
                            Submit
                        </MtUiButton>
                    </div>
                </div>
            </Sheet>
        </div>
    );
};

export default BottomConfigTest;

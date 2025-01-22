"use client";
import { MtUiButton } from "@/components/button";
import { shouldOpenSubmitTest } from "@/redux/features/tests";
import { useAppDispatch } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";
import React from "react";
type IProps = {
    isShow?: boolean;
};
const BtnSubmit: React.FC<IProps> = ({ isShow = false }) => {
    const type = useSearchParams()?.get("type");
    const dispatch = useAppDispatch();

    const setOpenConfirm = () => dispatch(shouldOpenSubmitTest(true));
    if (type === "test" || isShow) {
        return (
            <MtUiButton
                animated
                className="py-3 px-8 border-primary text-primary"
                block
                onClick={setOpenConfirm}
            >
                Submit
            </MtUiButton>
        );
    }
    return null;
};

export default React.memo(BtnSubmit);

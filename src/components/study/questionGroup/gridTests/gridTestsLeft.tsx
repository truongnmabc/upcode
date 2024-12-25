"use client";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import { db } from "@/db/db.model";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import ItemTestLeft from "./itemTest";

type IListTest = {
    parentId: number;
    duration: number;
};
const FN = () => {
    const { appInfo } = useAppSelector(appInfoState);

    const [listPracticeTests, setListPracticeTests] = useState<IListTest[]>([]);
    const type = useSearchParams().get("type");

    const [open, setOpen] = React.useState(type === "test");

    const handleClick = () => {
        setOpen(!open);
    };

    const handleGetData = useCallback(async () => {
        const listData = await db?.testQuestions
            .filter((test) => test.type === "practiceTests")
            .toArray();
        if (listData) {
            setListPracticeTests(
                listData?.map((item) => ({
                    duration: item.duration,
                    parentId: item.parentId,
                }))
            );
        }
    }, []);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);

    return (
        <div className="text-xl font-poppins capitalize font-semibold">
            <div
                className="flex justify-between items-center w-full"
                onClick={handleClick}
            >
                <h3 className="font-semibold text-xl font-poppins">
                    More {appInfo.appShortName} Tests
                </h3>
                {open ? <ExpandLess /> : <ExpandMore />}
            </div>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <div className="w-full flex mt-3 flex-col gap-2">
                    {listPracticeTests?.map((test, index) => (
                        <ItemTestLeft key={index} index={index} test={test} />
                    ))}
                </div>
            </Collapse>
        </div>
    );
};

const GridTestsLeft = React.memo(FN);
export default GridTestsLeft;

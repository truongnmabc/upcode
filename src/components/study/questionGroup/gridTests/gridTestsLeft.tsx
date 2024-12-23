"use client";
import { appInfoState } from "@/redux/features/appInfo";
import { useAppSelector } from "@/redux/hooks";
import { db } from "@/db/db.model";
import { ITest } from "@/models/tests/tests";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ItemTestLeft from "./itemTest";

const FN = () => {
    const { appInfo } = useAppSelector(appInfoState);

    const [listPracticeTests, setListPracticeTests] = useState<ITest[]>([]);
    const type = useSearchParams().get("type");

    const [open, setOpen] = React.useState(type === "test");

    const handleClick = () => {
        setOpen(!open);
    };

    const handleGetData = async () => {
        const listData = await db?.tests
            .filter((test) => test.testType === "practiceTests")
            .toArray();
        if (listData) {
            setListPracticeTests(listData);
        }
    };

    useEffect(() => {
        handleGetData();
    }, []);

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

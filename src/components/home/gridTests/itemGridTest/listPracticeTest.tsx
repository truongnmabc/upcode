import ItemTestLeft from "@/components/gridTests/itemTest";
import { db } from "@/db/db.model";
import Collapse from "@mui/material/Collapse";
import React, { useCallback, useEffect, useState } from "react";

type IListTest = {
    parentId: number;
    duration: number;
};

const ListPracticeTest = ({ open }: { open: boolean }) => {
    const [listPracticeTests, setListPracticeTests] = useState<IListTest[]>([]);

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
        <Collapse in={open} timeout="auto" unmountOnExit className="w-full">
            <div className="w-full flex  flex-col gap-2">
                {listPracticeTests?.map((test, index) => (
                    <ItemTestLeft key={index} index={index} test={test} />
                ))}
            </div>
        </Collapse>
    );
};

export default React.memo(ListPracticeTest);

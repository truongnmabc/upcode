import React from "react";
import Drawer from "@mui/material/Drawer";
import IconBack from "@/components/icon/iconBack";
import ReviewAnswerResult from "@/components/reviewAnswers";
import { ITopicEndTest } from "..";
import { ICurrentGame } from "@/models/game/game";

type IProps = {
    openDrawer: boolean;
    handleCloseDrawer: () => void;
    tableData: {
        all: ICurrentGame[];
        correct: ICurrentGame[];
        incorrect: ICurrentGame[];
    };
    result?: {
        listTopic: ITopicEndTest[];
        all: ICurrentGame[];
        correct: ICurrentGame[];
        incorrect: ICurrentGame[];
    };
    setTabletData?: (e: {
        all: ICurrentGame[];
        correct: ICurrentGame[];
        incorrect: ICurrentGame[];
    }) => void;
};
const DrawerAnswers = ({
    openDrawer,
    handleCloseDrawer,
    tableData,
    setTabletData,
    result,
}: IProps) => {
    return (
        <Drawer
            open={openDrawer}
            onClose={handleCloseDrawer}
            anchor="right"
            sx={{
                "& .MuiDrawer-paper": {
                    left: 0,
                },
            }}
        >
            <div className="w-full flex flex-col gap-4 h-full p-4">
                <div className="flex items-center justify-between">
                    <div onClick={handleCloseDrawer}>
                        <IconBack />
                    </div>
                    <p className="text-base font-semibold">
                        Review Your Answers
                    </p>
                    <p></p>
                </div>

                <div className="flex-1">
                    <ReviewAnswerResult
                        all={tableData.all}
                        correct={tableData.correct}
                        incorrect={tableData.incorrect}
                        setTabletData={setTabletData}
                        result={result}
                        type="custom"
                    />
                </div>
            </div>
        </Drawer>
    );
};

export default DrawerAnswers;

import QuestionResult from "@/components/questionReview";
import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { IQuestionOpt } from "@/models/question";
import { IUserActions } from "@/models/user/userReactions";
import { setListQuestionGames } from "@/redux/features/game";
import { setListReactions } from "@/redux/features/user";
import { useAppDispatch } from "@/redux/hooks";
import clsx from "clsx";
import React, { useContext, useEffect, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { ReviewContext } from "../../context";
import RandomGameContent from "../random/randomGameContent";

const Row = ({
    index,
    style,
    data,
}: {
    index: number;
    style: React.CSSProperties;
    data: ICurrentGame[];
}) => {
    return (
        <div style={style} className="w-full py-2  h-full">
            <QuestionResult key={index} item={data[index]} />
        </div>
    );
};
const getSavedActionsId = async (list: IUserActions[]) => {
    return list?.map((item) => item.questionId);
};

const SavedQuestionsMobileLayout = () => {
    const [data, setData] = useState<IQuestionOpt[]>([]);
    const dispatch = useAppDispatch();
    const { isStart } = useContext(ReviewContext);

    useEffect(() => {
        const fetchData = async () => {
            const list = await db?.useActions
                .filter((item) => item.actions?.includes("save"))
                .toArray();

            dispatch(setListReactions(list));
            if (list?.length) {
                const savedActions = await getSavedActionsId(list);
                const questions =
                    (await db?.questions
                        .where("id")
                        .anyOf(savedActions)
                        .toArray()) || [];

                setData(questions);
                dispatch(setListQuestionGames(questions));
            }
        };

        fetchData();
    }, [dispatch]);

    return (
        <div
            className={clsx(
                "w-full h-full flex-1 flex flex-col transition-all",
                {
                    "h-[400px]": data.length > 0 && !isStart,
                    "h-[800px]": data.length > 2 && !isStart,
                }
            )}
        >
            {isStart ? (
                <RandomGameContent />
            ) : (
                <div className="w-full flex-1 h-full">
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                height={height}
                                itemCount={data.length}
                                itemSize={400}
                                width={width}
                                itemData={data}
                                className="scrollbar-none"
                            >
                                {Row}
                            </List>
                        )}
                    </AutoSizer>
                </div>
            )}
        </div>
    );
};

export default SavedQuestionsMobileLayout;

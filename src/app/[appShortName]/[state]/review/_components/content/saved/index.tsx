import IconEmpty from "@/components/icon/iconEmpty";
import QuestionResult from "@/components/questionReview";
import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { IQuestion } from "@/models/question/questions";
import { IUserActions } from "@/models/user/userReactions";
import { setListReactions } from "@/redux/features/user";
import { useAppDispatch } from "@/redux/hooks";
import { MathJaxContext } from "better-react-mathjax";
import React, { Fragment, useEffect, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";

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

const SavedQuestions = () => {
    const [data, setData] = useState<IQuestion[]>([]);
    const dispatch = useAppDispatch();
    const getSavedActions = async (list: IUserActions[]) => {
        return list?.reduce<number[]>(
            (prev, next) =>
                next?.partId && !prev.includes(next.partId)
                    ? [...prev, next.partId]
                    : prev,
            []
        );
    };

    const getSavedQuestions = async (
        partIds: number[],
        list: IUserActions[]
    ) => {
        const listSaved: IQuestion[] = [];
        for (const id of partIds) {
            const result = await db?.topicQuestion
                .where("id")
                .equals(id)
                .first();
            if (result?.questions) {
                const filteredQuestions = result.questions.filter((item) =>
                    list.some((l) => l.questionId === item.id)
                );
                listSaved.push(...filteredQuestions);
            }
        }
        return listSaved;
    };

    useEffect(() => {
        const fetchData = async () => {
            const list = await db?.useActions
                .filter((item) => item.actions?.includes("save"))
                .toArray();

            dispatch(setListReactions(list));
            if (list?.length) {
                const savedActions = await getSavedActions(list);
                if (savedActions) {
                    const savedQuestions = await getSavedQuestions(
                        savedActions,
                        list
                    );
                    setData(savedQuestions);
                }
            }
        };

        fetchData();
    }, [dispatch]);

    return (
        <div className="w-full flex-1 transition-all">
            <MathJaxContext>
                {data.length > 0 ? (
                    <div className="w-full flex-1 min-h-screen">
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
                ) : (
                    <div className="w-full  flex-1 flex items-center justify-center">
                        <IconEmpty size={72} />
                    </div>
                )}
            </MathJaxContext>
        </div>
    );
};

export default SavedQuestions;

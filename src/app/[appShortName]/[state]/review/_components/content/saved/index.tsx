import Empty from "@/components/empty";
import QuestionResult from "@/components/questionReview";
import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { IQuestionOpt } from "@/models/question";
import { IUserActions } from "@/models/user/userReactions";
import { setListQuestionGames } from "@/redux/features/game";
import { setListReactions } from "@/redux/features/user";
import { useAppDispatch } from "@/redux/hooks";
import { MathJaxContext } from "better-react-mathjax";
import React, { useEffect, useState } from "react";
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
const getSavedActions = async (list: IUserActions[]) => {
    return list?.reduce<number[]>(
        (prev, next) =>
            next?.partId && !prev.includes(next.partId)
                ? [...prev, next.partId]
                : prev,
        []
    );
};

const getSavedQuestions = async (partIds: number[], list: IUserActions[]) => {
    const listSaved: IQuestionOpt[] = [];
    for (const id of partIds) {
        const result = await db?.topicQuestion.where("id").equals(id).first();
        if (result?.questions) {
            const filteredQuestions = result.questions.filter((item) =>
                list.some((l) => l.questionId === item.id)
            );
            listSaved.push(...filteredQuestions);
        }
    }
    return listSaved;
};

const SavedQuestions = () => {
    const [data, setData] = useState<IQuestionOpt[]>([]);
    const dispatch = useAppDispatch();

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
                    dispatch(setListQuestionGames(savedQuestions));
                }
            }
        };

        fetchData();
    }, [dispatch]);

    return (
        <div className="w-full flex-1 h-full transition-all">
            {data.length > 0 ? (
                <MathJaxContext>
                    <div className="w-full flex-1 ">
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
                </MathJaxContext>
            ) : (
                <Empty />
            )}
        </div>
    );
};

export default SavedQuestions;

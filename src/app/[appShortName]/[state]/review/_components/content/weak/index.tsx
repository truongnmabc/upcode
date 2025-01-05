import IconEmpty from "@/components/icon/iconEmpty";
import QuestionResult from "@/components/questionReview";
// import { CustomTabPanel } from "@/components/tabs";
import { db } from "@/db/db.model";
import { ICurrentGame } from "@/models/game/game";
import { IUserQuestionProgress } from "@/models/progress/userQuestionProgress";
import { startRandomReview } from "@/redux/features/game";
import { useAppDispatch } from "@/redux/hooks";
import { MathJaxContext } from "better-react-mathjax";
import React, { useEffect } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";

const WeakQuestions = () => {
    const dispatch = useAppDispatch();
    const [listTopic, setListTopic] = React.useState<IUserQuestionProgress[]>(
        []
    );
    useEffect(() => {
        const handleGetData = async () => {
            const data = await db?.userProgress.toArray();
            if (data) {
                const incorrect = data.filter(
                    (item) => !item.selectedAnswer?.correct
                );

                setListTopic(incorrect);
                console.log("🚀 ~ handleGetData ~ incorrect:", incorrect);

                dispatch(
                    startRandomReview({
                        listQuestion: incorrect,
                    })
                );
            }
        };
        handleGetData();
    }, [dispatch]);
    return (
        <div className="flex-1 min-h-[720px] w-full">
            {listTopic?.length > 0 ? (
                <MathJaxContext>
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                height={height}
                                itemCount={listTopic.length}
                                itemSize={340}
                                width={width}
                                itemData={listTopic}
                                className="scrollbar-none"
                            >
                                {Row}
                            </List>
                        )}
                    </AutoSizer>
                </MathJaxContext>
            ) : (
                <div className="flex justify-center items-center h-48">
                    <IconEmpty size={72} />
                </div>
            )}
        </div>
    );
};

export default WeakQuestions;

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

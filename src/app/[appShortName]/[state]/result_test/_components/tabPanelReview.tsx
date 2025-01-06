import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";
import { ICurrentGame } from "@/models/game/game";
import { MyCrypto } from "@/utils/myCrypto";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Fragment } from "react";
import QuestionResult from "@/components/questionReview";
import IconEmpty from "@/components/icon/iconEmpty";
interface TabPanelProps {
    index: number;
    value: number;
    data: ICurrentGame[];
}

function TabPanelReview(props: TabPanelProps) {
    const { value, index, data } = props;
    const isMobile = useIsMobile();

    const getItemSize = (index: number) =>
        MyCrypto.decrypt(data[index]?.text)?.length > 240
            ? isMobile
                ? 660
                : 400
            : isMobile
            ? 500
            : 330;

    return (
        <Fragment>
            {value === index && (
                <Fragment>
                    {data.length > 0 ? (
                        <AutoSizer>
                            {({ height, width }) => (
                                <List
                                    height={height}
                                    itemCount={data.length}
                                    itemSize={getItemSize}
                                    width={width}
                                    itemData={data}
                                    className="scrollbar-none"
                                >
                                    {Row}
                                </List>
                            )}
                        </AutoSizer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <IconEmpty size={72} />
                        </div>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
}

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

export default TabPanelReview;

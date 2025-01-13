import VariableSizeList from "@/components/infinite";
import QuestionResult from "@/components/questionReview";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ICurrentGame } from "@/models/game/game";
interface TabPanelProps {
    index: number;
    value: number;
    data: ICurrentGame[];
}

function TabPanelReview(props: TabPanelProps) {
    const { value, index, data } = props;
    const isMobile = useIsMobile();

    const getItemSize = (index: number) =>
        data[index]?.image ? (isMobile ? 460 : 400) : isMobile ? 420 : 330;

    if (value === index) {
        return (
            <VariableSizeList
                data={data}
                getItemSize={getItemSize}
                item={(item) => <QuestionResult item={item} />}
            />
        );
    }
    return null;
}

export default TabPanelReview;

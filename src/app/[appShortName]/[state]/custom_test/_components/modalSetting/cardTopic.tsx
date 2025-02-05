import LazyLoadImage from "@/components/images";
import { ITopicProgress } from "@/models/topics/topicsProgress";
import ctx from "@/utils/mergeClass";
import clsx from "clsx";

type ICardTopic = {
    item: ITopicProgress;
    selectListTopic: ITopicProgress[];
    setSelectListTopic: (
        e: ITopicProgress[] | ((prev: ITopicProgress[]) => ITopicProgress[])
    ) => void;
};
const CardTopic = ({
    item,
    selectListTopic,
    setSelectListTopic,
}: ICardTopic) => {
    const isCheck = selectListTopic.some((s) => s.id === item.id);
    const handleSelect = () => {
        setSelectListTopic((prev: ITopicProgress[]) => {
            const isAlreadySelected = prev.some(
                (s: ITopicProgress) => s.id === item.id
            );
            if (isAlreadySelected) {
                return prev.filter((s: ITopicProgress) => s.id !== item.id);
            }
            return [...prev, item];
        });
    };
    return (
        <div
            onClick={handleSelect}
            className={clsx(
                " cursor-pointer w-full flex bg-white items-center justify-between gap-[10px] rounded-lg sm:border border-solid p-0 sm:p-4 ",
                {
                    "border-primary ": isCheck,
                    "border-[#2121211F]  ": !isCheck,
                }
            )}
        >
            <div className="w-8 p-1 h-8 rounded-lg bg-[#7C6F5B]">
                <LazyLoadImage src={item.icon} />
            </div>
            <p className="text-sm flex-1 font-medium">{item.name}</p>
            <div
                className={ctx(
                    "w-5 h-5 rounded-md border border-solid flex items-center overflow-hidden  justify-center ",
                    {
                        "border-primary bg-primary ": isCheck,
                        "border-[#21212152] ": !isCheck,
                    }
                )}
            >
                <IconCheck />
            </div>
        </div>
    );
};

export const IconCheck = () => {
    return (
        <svg
            width="11"
            height="8"
            viewBox="0 0 11 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M9.14356 0.473692C9.20327 0.412763 9.27454 0.364359 9.3532 0.331315C9.43185 0.29827 9.5163 0.28125 9.60162 0.28125C9.68693 0.28125 9.77139 0.29827 9.85004 0.331315C9.92869 0.364359 9.99997 0.412763 10.0597 0.473692C10.3099 0.726567 10.3134 1.13519 10.0684 1.39244L4.89456 7.50869C4.83581 7.5732 4.76453 7.62504 4.68506 7.66105C4.60559 7.69706 4.51962 7.71648 4.43239 7.71811C4.34516 7.71975 4.25851 7.70358 4.17775 7.67058C4.09698 7.63758 4.0238 7.58845 3.96268 7.52619L0.81443 4.33594C0.693013 4.21212 0.625 4.04561 0.625 3.87219C0.625 3.69877 0.693013 3.53227 0.81443 3.40844C0.874146 3.34751 0.945417 3.29911 1.02407 3.26606C1.10272 3.23302 1.18718 3.216 1.27249 3.216C1.35781 3.216 1.44226 3.23302 1.52092 3.26606C1.59957 3.29911 1.67084 3.34751 1.73056 3.40844L4.40106 6.11482L9.12606 0.492942C9.1315 0.48618 9.13734 0.479752 9.14356 0.473692Z"
                fill="white"
            />
        </svg>
    );
};

export default CardTopic;

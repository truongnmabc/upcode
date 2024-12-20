import ClockIcon from "@/components/icon/ClockIcon";
import LazyLoadImage from "@/components/images";
import Time from "@/components/study/contentGroup/mainStudyView/time/time";
import { gameState } from "@/redux/features/game";
import { useAppSelector } from "@/redux/hooks";

const TimeTestGetLever = () => {
    const { currentGame } = useAppSelector(gameState);

    return (
        <div className="w-full bg-[#F0F4F9] px-3 py-[14px] rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-1">
                <LazyLoadImage
                    classNames="w-6 h-6"
                    src="/images/notebook-dynamic-color.png"
                />
                <p className=" capitalize text-sm font-medium">
                    {currentGame?.tag}
                </p>
            </div>
            <div className="flex items-center justify-center w-fit gap-2">
                <ClockIcon />
                <Time />
            </div>
            <div className="px-2 py-1 flex items-center rounded-lg bg-[#FCFCFC]">
                <p className="text-sm text-[#21212185]  font-medium pr-1">
                    Level
                </p>
                <IconStarLevel
                    level={
                        currentGame?.level === -1
                            ? 2
                            : currentGame?.level < 30
                            ? 1
                            : currentGame?.level <= 60
                            ? 2
                            : 3
                    }
                    defaultLevel={1}
                />
                <IconStarLevel
                    level={
                        currentGame?.level === -1
                            ? 2
                            : currentGame?.level < 30
                            ? 1
                            : currentGame?.level <= 60
                            ? 2
                            : 3
                    }
                    defaultLevel={2}
                />
                <IconStarLevel
                    level={
                        currentGame?.level === -1
                            ? 2
                            : currentGame?.level < 30
                            ? 1
                            : currentGame?.level <= 60
                            ? 2
                            : 3
                    }
                    defaultLevel={3}
                />
            </div>
        </div>
    );
};

export default TimeTestGetLever;

const IconStarLevel = ({
    level,
    defaultLevel,
}: {
    level: number;
    defaultLevel: number;
}) => {
    if (level >= defaultLevel) {
        return (
            <LazyLoadImage
                classNames="w-6 h-6"
                src="/images/rate/star-dynamic-color.png"
            />
        );
    } else {
        return (
            <LazyLoadImage
                classNames="w-6 h-6"
                src="/images/rate/star-dynamic-color-1.png"
            />
        );
    }
};

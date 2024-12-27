import LazyLoadImage from "@/components/images";
import { ITopic } from "@/models/topics/topics";
import React, { useCallback } from "react";
import { ITopicEndTest } from "..";
import { useRouter } from "next/navigation";
import { revertPathName } from "@/utils/pathName";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { appInfoState } from "@/redux/features/appInfo";
import { handleNavigateStudy } from "@/components/home/gridTopic/item/titleTopic";

type IProps = {
    item: ITopicEndTest;
};

const ItemListTopicResult: React.FC<IProps> = ({ item }) => {
    const progress = Math.floor((item.correct / item.totalQuestion) * 100);
    const router = useRouter();
    const { appInfo } = useAppSelector(appInfoState);
    const dispatch = useAppDispatch();
    const handleImprove = useCallback(() => {
        handleNavigateStudy({
            appShortName: appInfo.appShortName,
            dispatch,
            router,
            topic: item,
            isReplace: true,
        });
    }, [router, appInfo.appShortName, dispatch]);
    return (
        <div className="w-full p-4 rounded-xl border border-solid bg-white sm:gap-2 lg:gap-4 flex items-center justify-between">
            <div className="flex items-center overflow-hidden flex-1 gap-2">
                <div
                    style={{
                        backgroundColor: item.color,
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center "
                >
                    <LazyLoadImage
                        src={item.icon}
                        classNames="w-5 bg-[#E3A65129] h-5"
                    />
                </div>
                <p className="text-base  font-medium flex-1  truncate">
                    {item.name}
                </p>
            </div>
            <div className=" flex items-center  gap-1">
                <div className="custom-header-progress w-[160px]">
                    <progress className="" value={progress} max={100} />
                </div>
                <p className="text-sm font-medium w-12">{progress} %</p>
            </div>
            <div
                onClick={handleImprove}
                className=" rounded-[30px] cursor-pointer px-4 py-2 bg-[#E3A65129] font-medium text-base text-[#E3A651] "
            >
                Improve
            </div>
        </div>
    );
};

export default ItemListTopicResult;

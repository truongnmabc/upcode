import LazyLoadImage from "@/components/images";
import { ITopic } from "@/models/topics/topics";
import React from "react";
import { ITopicEndTest } from "..";

type IProps = {
    item: ITopicEndTest;
};

const ItemListTopicResult: React.FC<IProps> = ({ item }) => {
    const progress = Math.floor((item.incorrect / item.totalQuestion) * 100);

    return (
        <div className="w-full p-4 rounded-xl border border-solid bg-white gap-6 flex items-center justify-between">
            <div className="flex items-center flex-1 gap-2">
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
                <p className="text-base font-medium max-w-40 truncate">
                    {item.name}
                </p>
            </div>
            <div className=" flex items-center w-[220px] gap-1">
                <div className="custom-header-progress w-[180px]">
                    <progress className="" value={progress} max={100} />
                </div>
                <p className="text-sm font-medium">{progress} %</p>
            </div>
            <div className=" rounded-[30px] px-4 py-2 bg-[#E3A65129] font-medium text-base text-[#E3A651] ">
                Improve
            </div>
        </div>
    );
};

export default ItemListTopicResult;

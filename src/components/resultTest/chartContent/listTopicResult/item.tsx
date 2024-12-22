import LazyLoadImage from "@/components/images";
import React from "react";
type IItem = {
    icon: string;
    name: string;
};
type IProps = {
    item: IItem;
};

const ItemListTopicResult: React.FC<IProps> = ({ item }) => {
    return (
        <div className="w-full p-4 rounded-xl border border-solid bg-white gap-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center bg-[#E3A65129]">
                    {/* <LazyLoadImage src={item.icon} classNames="w-6 h-6" /> */}
                </div>
                <p className="text-base font-medium max-w-40 truncate">
                    {item.name}
                </p>
            </div>
            <div className="custom-header-progress flex-1">
                <progress className="w-full" />
            </div>
            <div className=" rounded-[30px] px-4 py-2 bg-[#E3A65129] font-medium text-base text-[#E3A651] ">
                Improve
            </div>
        </div>
    );
};

export default ItemListTopicResult;

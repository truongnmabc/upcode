import { IAppInfo } from "@/models/app/appInfo";
import { ITopic } from "@/models/topics/topics";
import clsx from "clsx";
import TitleTopic from "./item/titleTopic";
import Wrapper from "./item/wrapper";
import React from "react";

const GridTopics = ({
    topics,
    appInfo,
    isAll,
}: {
    appInfo: IAppInfo;
    isAll: boolean;
    topics: ITopic[];
}) => {
    return (
        <div className="w-full  pt-6 sm:pt-14">
            <h3 className="sm:text-[32px] sm:leading-[48px] font-poppins text-center text-lg font-bold">
                Practice {appInfo.appName} Test By Topics
            </h3>
            <h3 className="text-xs sm:text-base my-2 sm:my-8 text-[#212121CC] sm:text-[#212121] text-center">
                {isAll
                    ? `Our free ${appInfo?.appName} practice tests feature all ${appInfo?.appName} test subjects. We recommend taking at least one practice exam from every subject to guarantee your success at your local testing location. To get started, choose a category from the list below and practice them!`
                    : `Our free ${appInfo?.appName} practice tests feature all ${appInfo?.appName} test subjects. We recommend taking all practice questions to guarantee your success at your local testing location.`}
            </h3>
            <div
                className={clsx(
                    "grid  mt-6 sm:mt-10 sm:grid-cols-1 gap-4 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-4 md:gap-4"
                )}
            >
                {topics?.map((topic, index) => (
                    <div
                        key={index}
                        className={clsx(
                            "w-full h-full flex flex-col  sm:block"
                        )}
                    >
                        <TitleTopic
                            topic={topic}
                            priority={3}
                            classNames=" h-[52px] sm:h-[72px]"
                            imgClassNames="w-[52px] h-[52px] sm:w-[72px] sm:h-[72px]"
                        />
                        <Wrapper topic={topic} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(GridTopics);

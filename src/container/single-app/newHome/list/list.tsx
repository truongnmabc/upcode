import React from "react";
import ItemTopicHome from "./item";
import { IAppInfo } from "@/models/AppInfo";
import { ITopic } from "@/models/Topic";
import { ITestInfo } from "@/models/TestInfo";

const ListHome = ({
    listTopics,
    tests,
    appInfo,
    _state,
}: {
    appInfo: IAppInfo;
    listTopics: ITopic[];
    tests: ITestInfo[];
    _state: string;
}) => {
    return (
        <div className="w-full h-full pt-4  pb-6 sm:pb-12 flex flex-col gap-6 sm:gap-8 ">
            {listTopics.map((topic, index) => (
                <ItemTopicHome
                    key={index}
                    topic={topic}
                    test={tests?.find((t) => t.tag === topic.tag)}
                    appInfo={appInfo}
                    _state={_state}
                />
            ))}
        </div>
    );
};

export default ListHome;

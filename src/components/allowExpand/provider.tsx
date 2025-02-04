import { ITopicProgress } from "@/models/topics/topicsProgress";
import React, { ReactNode } from "react";

export interface IContextAllowExpand {
    color?: string;
    mainTopic?: ITopicProgress | null;
    mainTopicTag: string | null;
}

export const AllowExpandContext = React.createContext<IContextAllowExpand>({
    color: "red",
    mainTopic: undefined,
    mainTopicTag: "",
});

const AllowExpandProvider = ({
    children,
    topic,
}: {
    children: ReactNode;
    topic: ITopicProgress | null;
}) => {
    const value = {
        mainTopic: topic,
        mainTopicTag: topic ? topic.tag : "",
    };

    return (
        <AllowExpandContext.Provider value={value}>
            {children}
        </AllowExpandContext.Provider>
    );
};
export default AllowExpandProvider;

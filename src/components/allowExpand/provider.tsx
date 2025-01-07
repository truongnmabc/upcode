import { ITopic } from "@/models/topics/topics";
import React, { ReactNode } from "react";

export interface IContextAllowExpand {
    color?: string;
    mainTopic?: ITopic;
    mainTopicTag: string;
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
    topic: ITopic;
}) => {
    const value = {
        mainTopic: topic,
        mainTopicTag: topic.tag,
    };

    return (
        <AllowExpandContext.Provider value={value}>
            {children}
        </AllowExpandContext.Provider>
    );
};
export default AllowExpandProvider;

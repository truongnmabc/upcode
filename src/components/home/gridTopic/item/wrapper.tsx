"use client";
import { ITopic } from "@/models/topics/topics";
import AllowExpand from "../../../allowExpand";
import AllowExpandProvider from "../../../allowExpand/provider";

const Wrapper = ({ topic }: { topic: ITopic }) => {
    return (
        <AllowExpandProvider topic={topic}>
            <AllowExpand />
        </AllowExpandProvider>
    );
};

export default Wrapper;

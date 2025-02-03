"use client";
import { ITopic } from "@/models/topics/topics";
import AllowExpandProvider from "../../../allowExpand/provider";
import dynamic from "next/dynamic";
const AllowExpand = dynamic(() => import("../../../allowExpand"), {
    ssr: false,
});
const Wrapper = ({ topic }: { topic: ITopic }) => {
    return (
        <AllowExpandProvider topic={topic}>
            <AllowExpand />
        </AllowExpandProvider>
    );
};

export default Wrapper;

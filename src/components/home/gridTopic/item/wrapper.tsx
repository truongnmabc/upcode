"use client";
import { ITopic } from "@/models/topics/topics";
import AllowExpandProvider from "../../../allowExpand/provider";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const AllowExpand = dynamic(() => import("../../../allowExpand"), {
    ssr: false,
});
const Wrapper = () => {
    const [topic, setTopic] = useState<ITopic>({});

    useEffect(() => {
        return () => {};
    }, []);

    return (
        <AllowExpandProvider topic={topic}>
            <AllowExpand />
        </AllowExpandProvider>
    );
};

export default Wrapper;

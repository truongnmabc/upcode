import { db } from "@/db/db.model";
import React, { useEffect } from "react";

const SavedQuestions = () => {
    useEffect(() => {
        const handleGetData = async () => {
            const data = await db?.userProgress.toArray();
            console.log("🚀 ~ handleGetData ~ data:", data);
        };
        handleGetData();
    }, []);

    return <div>SavedQuestions</div>;
};

export default SavedQuestions;

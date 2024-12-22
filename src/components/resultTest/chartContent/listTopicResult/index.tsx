import React from "react";
import ItemListTopicResult from "./item";

const ListTopicResult = () => {
    return (
        <div className="flex-1 flex flex-col gap-4 ">
            <ItemListTopicResult
                item={{
                    icon: "",
                    name: "Auto and Shop ... ",
                }}
            />
            <ItemListTopicResult
                item={{
                    icon: "",
                    name: "General Science",
                }}
            />
        </div>
    );
};

export default ListTopicResult;

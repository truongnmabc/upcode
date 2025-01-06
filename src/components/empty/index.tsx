import React from "react";
import IconEmpty from "../icon/iconEmpty";

const Empty = () => {
    return (
        <div className="w-full p-4 bg-white rounded-lg flex-col gap-2  h-full flex items-center justify-center">
            <IconEmpty size={72} />
            <p>List Empty</p>
        </div>
    );
};

export default Empty;

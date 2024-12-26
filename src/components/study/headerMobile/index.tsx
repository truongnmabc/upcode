import React from "react";
import HeaderStudy from "./headerStudy";
import LevelGameProgress from "./levelGameProgress";

const FN = () => {
    return (
        <div className="block sm:hidden w-full">
            <div className="w-full pb-1 sm:px-4 sm:py-2">
                <HeaderStudy />
            </div>
            <LevelGameProgress />
        </div>
    );
};

const HeaderMobile = React.memo(FN);

export default HeaderMobile;

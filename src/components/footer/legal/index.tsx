"use client";
import React from "react";
import { TitleDesFooter } from "../titleDesFooter";
import RouterApp from "@/common/router/router.constant";

const FN = () => {
    return (
        <div className="flex flex-col gap-2 w-full   ">
            <p className=" uppercase text-white text-base font-semibold pb-2">
                LEGAL
            </p>
            <TitleDesFooter
                title="Editorial Policy"
                link={RouterApp.Edit_policy}
            />
            <TitleDesFooter title="Privacy Policy" link={RouterApp.Privacy} />
            <TitleDesFooter
                title="Terms & Conditions"
                link={RouterApp.Teams_of_service}
            />
            <TitleDesFooter
                title="Refund Policy"
                link={RouterApp.Refund_policy}
            />
        </div>
    );
};
const LegalFooter = React.memo(FN);
export default LegalFooter;

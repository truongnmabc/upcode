import React from "react";
import "./index.scss";
import { IAppInfo } from "@/models/app/appInfo";
import FaqAsvab from "../asvab/faqAsvab";
import FaqCDL from "../cdl/faqCDL";
export interface IFAQData {
    question: string;
    answer: string | any;
}

const BodyComponent = ({ appInfo }: { appInfo: IAppInfo }) => {

    const returnFaq = () => {

        switch (appInfo.appName.toLocaleLowerCase()) {
            case "cdl":
                return <FaqCDL />

            case "asvab":
                return <FaqAsvab />
        }
    }
    return (
        <div className="contact-body-component">
            <div className="contact-body-container">
                <div className="title">FAQs</div>
                {returnFaq()}
            </div>
        </div>
    );
};



export default BodyComponent;

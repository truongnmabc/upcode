import { useState } from "react";
import FaqsAndQaContent, { TYPE_TAB } from "./content";
import "./index.scss";
import SearchQuestion from "./search-question";
import MyContainer from "../container";
import { IAppInfo } from "@/models/app/appInfo";

const FaqsAndQaComponent = ({
    appInfo,
    isSingleQa,
}: {
    appInfo: IAppInfo;
    isSingleQa?: boolean;
}) => {
    const tabSelected =
        typeof window !== "undefined" && localStorage.getItem("selectedTab");

    const [tab, setTab] = useState<string>(
        tabSelected ? tabSelected : TYPE_TAB.Faq
    );
    return (
        <div className="faq-container">
            <div>
                <MyContainer>
                    <div className="faq-title">
                        <h1>How can we help you?</h1>
                        <p>Have questions? We’re here to help.</p>
                    </div>
                </MyContainer>
                <SearchQuestion setTab={(value) => setTab(value)} />
                <FaqsAndQaContent
                    tab={tab}
                    setTab={(value) => setTab(value)}
                    isSingleQa={isSingleQa}
                />
            </div>
        </div>
    );
};
export default FaqsAndQaComponent;

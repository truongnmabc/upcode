import "./ParentAppLayoutV0.scss";
import { IAppInfo } from "@/models/app/appInfo";
import ParentAppHeaderV0 from "./components/header/ParentAppHeaderV0";
import ContentSeoV0 from "./components/parent-app-component/ContentSeoV0";
import AppsSectionV0 from "./components/parent-app-component/AppsSectionV0";
import CompleteFreeV0 from "./components/parent-app-component/CompleteFreeV0";
import FeedbackV0 from "./components/parent-app-component/FeedbackV0";

const ParentAppLayoutV0 = ({
    descriptionSEO,
    titleSEO,
    listAppInfo,
}: {
    descriptionSEO: string;
    titleSEO: string;
    listAppInfo: IAppInfo[];
}) => {
    return (
        <div className="container-home-page">
            <ParentAppHeaderV0 />
            <ContentSeoV0 descriptionSEO={descriptionSEO} titleSEO={titleSEO} />
            <AppsSectionV0 listAppInfo={listAppInfo} />
            <CompleteFreeV0 />
            <FeedbackV0 />

            {/* NOTE : thiếu app footer */}
        </div>
    );
};

export default ParentAppLayoutV0;

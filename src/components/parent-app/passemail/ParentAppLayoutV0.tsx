import dynamic from "next/dynamic";
import "./ParentAppLayoutV0.scss";
// import { useMediaQuery } from "@mui/material";
import { IAppInfo } from "@/models/app/appInfo";
import ParentAppHeaderV0 from "./components/header/ParentAppHeaderV0";

// const ContentSeoV0 = dynamic(
//     () => import("./components/parent-app-component/ContentSeoV0")
// );
// const AppsSectionV0 = dynamic(
//     () => import("./components/parent-app-component/AppsSectionV0")
// );
// const CompleteFreeV0 = dynamic(
//     () => import("./components/parent-app-component/CompleteFreeV0")
// );
// const FeedbackV0 = dynamic(
//     () => import("./components/parent-app-component/FeedbackV0")
// );
// const AppFooterV0 = dynamic(() => import("./components/footer/AppFooterV0"));

const ParentAppLayoutV0 = ({
    appInfo,
    descriptionSEO,
    titleSEO,
    listAppInfo,
}: {
    appInfo: IAppInfo;
    descriptionSEO: string;
    titleSEO: string;
    listAppInfo: IAppInfo[];
}) => {
    return (
        <div className="container-home-page">
            <div>kkkk</div>
            <ParentAppHeaderV0 isDesktop={false} />
            {/* <ContentSeoV0 descriptionSEO={descriptionSEO} titleSEO={titleSEO} />
            <AppsSectionV0 appInfo={appInfo} listAppInfo={listAppInfo} />
            <CompleteFreeV0 />
            <FeedbackV0 />
            <AppFooterV0 appInfo={appInfo} themeType="parent" /> */}
        </div>
    );
};

export default ParentAppLayoutV0;

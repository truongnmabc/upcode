import HeaderV4 from "@/components/header/HeaderV4";
import FaqsAndQaComponent from "../../components/faqs-qa";
import { IAppInfo } from "../../models/AppInfo";
import "./style.scss";
import FooterLandingV4 from "@/components/footer/FooterLandingV4";

const FaqScreen = ({
    appInfo,

    isSingleQa,
}: {
    appInfo: IAppInfo;

    isSingleQa?: boolean;
}) => {
    return (
        <div className="faq-and-qa">
            <HeaderV4 appInfo={appInfo} topics={[]} tests={[]} />
            <FaqsAndQaComponent isSingleQa={isSingleQa} appInfo={appInfo} />
            <FooterLandingV4 appInfo={appInfo} />
        </div>
    );
};

export default FaqScreen;

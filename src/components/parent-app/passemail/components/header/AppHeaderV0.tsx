import { IAppInfo } from "@/models/AppInfo";
import dynamic from "next/dynamic";
import "./AppHeaderV0.scss";

const ClientHeader = dynamic(() => import("./ClientHeader"), {
    ssr: false,
    loading: () => <div className="client-header-v4-frame" />,
});
// header này về build client-side
const AppHeaderV0 = ({ appInfo, isReview }: { appInfo: IAppInfo; isReview?: boolean }) => {
    return <ClientHeader appInfo={appInfo} isReview={isReview} />;
};

export default AppHeaderV0;

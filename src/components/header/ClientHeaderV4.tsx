import { ITestInfo } from "@/models/TestInfo";
import { IAppInfo } from "../../models/AppInfo";
import { ITopic } from "../../models/Topic";
import dynamic from "next/dynamic";
const HeaderV4 = dynamic(() => import("./HeaderV4"), {
    ssr: false,
    loading: () => <div className="client-header-v4-frame" style={{ height: "53px" }} />,
});
const ClientHeaderV4 = ({
    appInfo,
    topics,
    tests,
}: {
    appInfo: IAppInfo;
    tests: ITestInfo[];
    topics: ITopic[]; // cần truyền và cái này để trang Home không cần phụ thuộc vào redux nữa => tránh mount 2 lần và bị nháy màn hình khi truy cập (do logic của file LayoutV4)
}) => {
    return <HeaderV4 appInfo={appInfo} topics={topics} tests={tests} />;
};
export default ClientHeaderV4;
// client-header-v4-frame

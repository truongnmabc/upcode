import GetProPage from "@/pagessss/upgrade-pro";
import { fetchAppData } from "@/utils/getAppInfos";

type Params = {
    params: Promise<{ appShortName: string; slug: string }>;
};
const Page = async ({ params }: Params) => {
    const { appShortName } = await params;

    const { appInfo } = await fetchAppData(appShortName);

    if (!appInfo) {
        throw new Error("App info not found");
    }
    return <GetProPage appInfo={appInfo} />;
};

export default Page;

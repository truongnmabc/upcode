import ContactsScreenView from "@/components/contact";
import { fetchAppData } from "@/utils/getAppInfos";

type Params = {
    params: Promise<{ appShortName: string; slug: string }>;
};
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact us – ABC Elearning",
    description: "...",
};
const ContactsScreen = async ({ params }: Params) => {
    const { appShortName } = await params;

    const { appInfo } = await fetchAppData(appShortName);

    if (!appInfo) {
        throw new Error("App info not found");
    }

    return <ContactsScreenView appInfo={appInfo} />;
};

export default ContactsScreen;

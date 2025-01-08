import ReviewView from "@/app/[appShortName]/[state]/review/_components";
import MyContainer from "@/components/container";
import { detectAgent } from "@/utils/detectDevice";
import { headers } from "next/headers";

export default async function Page() {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent");
    const isMobile = detectAgent(userAgent || "");

    return (
        <MyContainer className="py-4 sm:py-0">
            <ReviewView isMobile={isMobile} contentSeo="" />
        </MyContainer>
    );
}

import ReviewView from "@/app/[appShortName]/[state]/review/_components";
import MyContainer from "@/components/container";
import { userAgent } from "next/server";
import { headers } from "next/headers";
export const detectAgent = (userAgent: string): boolean => {
    return /android.+mobile|ip(hone|[oa]d)/i.test(userAgent);
};
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

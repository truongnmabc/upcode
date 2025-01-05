import ReviewView from "@/app/[appShortName]/[state]/review/_components";
import MyContainer from "@/components/container";

export default async function Page() {
    return (
        <MyContainer>
            <ReviewView contentSeo="" />
        </MyContainer>
    );
}

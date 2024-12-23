import ChartContentResultPage from "@/components/resultTest/chartContent";
import HeaderResultTest from "@/components/resultTest/header";
import ReviewAnswerResult from "@/components/resultTest/reviewAnswers";
import MyContainer from "@/components/v4-material/myContainer";

export default async function Page() {
    return (
        <div className="w-full flex-1">
            <div className="bg-[#FFE1E1]">
                <HeaderResultTest />
            </div>
            <MyContainer>
                <ChartContentResultPage />
                <ReviewAnswerResult />
            </MyContainer>
        </div>
    );
}

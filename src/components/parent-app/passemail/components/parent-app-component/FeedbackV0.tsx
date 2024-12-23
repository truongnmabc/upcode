import MyContainer from "@/components/container/myContainer";
import "./FeedbackV0.scss";
import SliderFeedBack from "./SliderWidgetV0";
const FeedbackV0 = () => {
    return (
        <>
            <div className="feedback-component-V0">
                <div className="feedback-container">
                    <div className="feedback-parameter">
                        <MyContainer className="container-title-feedback">
                            <h1 className="title-feedback">
                                What Our Users Are Saying
                            </h1>
                            <div className="numbers-feedback">
                                <div className="number-feedback">
                                    <div>10,123</div>
                                    <span>Users</span>
                                </div>
                                <div className="number-feedback">
                                    <div>20,432</div>
                                    <span>Downloads</span>
                                </div>
                                <div className="number-feedback">
                                    <div>7,871</div>
                                    <span>Likes</span>
                                </div>
                                <div className="number-feedback">
                                    <div>945</div>
                                    <span>5-Star Rating</span>
                                </div>
                            </div>
                        </MyContainer>
                    </div>
                </div>
                <SliderFeedBack />
            </div>
        </>
    );
};
export default FeedbackV0;

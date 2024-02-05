import { genFullStudyLink } from "@/utils/getStudyLink";
import { IAppInfo } from "../../models/AppInfo";
import { ITestInfo } from "../../models/TestInfo";
import * as ga from "../../services/ga";
import "./TestBanner.scss";
const TestBanner = ({ appInfo, test, index }: { appInfo: IAppInfo; test: ITestInfo; index: number }) => {
    let timeTest = Math.floor(test?.timeTest / 60);
    let _href = test.slug;
    return (
        <a
            href={_href}
            style={{ textDecoration: "none" }}
            onClick={(e) => {
                e.preventDefault(); // viết như này để ga được thực hiện
                ga.event({
                    action: "click_full_test",
                    params: {
                        from: window.location.href,
                    },
                });
                window.location.href = _href;
            }}
        >
            <div className={"v4-test-banner-0 v4-border-radius"}>
                <div className="v4-test-banner-content-0">
                    <h3 className="v4-font-semi-bold">{`${test.title} Test`}</h3>
                    <div className="v4-test-banner-content-1">
                        <div className="v4-test-banner-content-21">
                            <strong className="v4-font-semi-bold">{test?.totalQuestion ? test.totalQuestion : 0}</strong>
                            <div>questions</div>
                        </div>
                        <div className="v4-test-banner-content-22">
                            <strong className="v4-font-semi-bold">
                                {`${Math.floor((test?.totalQuestion * (100 - test?.passPercent)) / 100)}`} mistakes
                            </strong>
                            <div>allowed to pass</div>
                        </div>
                    </div>

                    <span className="v4-test-banner-description">
                        {`Complete practicing? Now this is a full ${appInfo.appName} practice test 
                        that mimics the real test. You'll have ${timeTest} minutes 
                        ${timeTest > 60 ? `(${Math.floor(timeTest / 60)} hours and ${timeTest % 60} minutes)` : ""} to finish ${
                            test?.totalQuestion
                        } questions 
                        from all ${test?.totalQuestion} ${appInfo.appName} sections.`}
                    </span>

                    <div className="v4-test-banner-content-button-practice v4-border-radius">Practice now!</div>
                </div>
                <figure
                    className="v4-test-banner-thumbnail-0"
                    style={{
                        backgroundImage:
                            index === 0
                                ? `url(/images/${appInfo.bucket}/test-card-desktop.png)`
                                : `url(/images/test-card-desktop-${index}.png)`,
                    }}
                ></figure>
            </div>
        </a>
    );
};

export default TestBanner;

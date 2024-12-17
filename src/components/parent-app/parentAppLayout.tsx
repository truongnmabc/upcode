import { useIsMobile } from "@/hooks/useIsMobile";
import { Fragment } from "react";
import AppAchievement from "@/components/parent-app/easy-prep/AppAchievement";
import ListApp from "@/components/parent-app/easy-prep/ListApp";
import Testimonals from "@/components/parent-app/easy-prep/Testimonals";
import { IAppInfo } from "@/models/app/appInfo";
import MyContainer from "../v4-material/myContainer";

const ParentAppLayout = ({
    appInfo,
    listAppInfos,
}: {
    appInfo: IAppInfo;
    listAppInfos?: IAppInfo[];
}) => {
    // const isMobile = useIsMobile();
    return (
        <Fragment>
            <MyContainer className="take-learning-to-the-next-level ">
                <div className="align-center -container">
                    <div className="landing-title">
                        {/* <h1 style={{ display: "none" }}>
                            {!isMobile
                                ? "Easy Prep: take learning to the next level"
                                : "Easy Solution For Teaching & Learning"}
                        </h1> */}
                        <div className="landing-title-text">
                            <img
                                src="/info/images/logo60.png"
                                alt="logo compact"
                            />
                            <span className="-for-desktop">
                                <span className="part-color-1">{`asy Prep`}</span>
                                {": Take Learning To The Next Level"}
                            </span>
                            <span className="-for-mobile">
                                <span className="part-color-1">{`asy `}</span>
                                {" Solution For Teaching & Learning"}
                            </span>
                        </div>

                        <p>
                            Our mission is to bring you the best online test
                            prep that you can learn anytime, anywhere.
                        </p>
                    </div>
                    <img
                        className="img-landing"
                        src="/images/easyprep/landing-img.png"
                        alt="Take learning"
                    />
                </div>
            </MyContainer>
            {listAppInfos && <ListApp listAppInfos={listAppInfos} />}
            <AppAchievement />
            <Testimonals />
        </Fragment>
    );
};

export default ParentAppLayout;

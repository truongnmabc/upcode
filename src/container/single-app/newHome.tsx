import MyContainer from "@/components/v4-material/MyContainer";
import { IAppInfo } from "@/models/AppInfo";
import { IItemBlock } from "@/models/stateChildrenApp";
import { ITestInfo } from "@/models/TestInfo";
import { ITopic } from "@/models/Topic";
import { useMediaQuery } from "@mui/material";
import dynamic from "next/dynamic";
import BannerHome from "./newHome/banner";
import Handbook from "./newHome/handBook";
import ListHome from "./newHome/list/list";
import SelectState from "./newHome/selectState";
const ListBlock = dynamic(() => import("./newHome/slider"));

const NewHome = ({
    appInfo,
    listTopics,
    _state,
    tests,
    listBlock,
}: {
    appInfo: IAppInfo;
    listTopics: ITopic[];
    tests: ITestInfo[];
    _state: string;
    listBlock?: IItemBlock[];
}) => {
    const isDesktop = useMediaQuery("(min-width:769px)");

    return (
        <div className="w-full h-full">
            <SelectState appInfo={appInfo} _state={_state} />
            <div>
                <MyContainer>
                    <div className="landing-title-0">
                        <div className="landing-title-11">
                            <h2 className="title-h1">
                                <p className="text-2xl w-full sm:text-[40px] text-center font-bold sm:leading-[60px]">{`${_state} ${appInfo?.appName} Practice Test`}</p>
                                {/* <span className="landing-title-22">
                                Ace The <strong className="v4-font-semi-bold">{appInfo?.appName}</strong> On First Try
                            </span> */}
                            </h2>
                        </div>
                        <div className="landing-title-12">
                            <p className="text-base w-full font-normal text-center">
                                Ace all {_state} DMV written tests with our two powerful systems: {isDesktop && <br />}
                                Master part by part in <span className="font-semibold">Practice mode</span> and experience the
                                real test atmosphere in <span className="font-semibold">Test mode</span>
                            </p>
                        </div>
                    </div>
                    <ListHome appInfo={appInfo} _state={_state} listTopics={listTopics} tests={tests} />
                </MyContainer>
                <ListBlock appInfo={appInfo} _state={_state} listBlock={listBlock} />
                <BannerHome appInfo={appInfo} _state={_state} />
                <Handbook appInfo={appInfo} _state={_state} />
            </div>
        </div>
    );
};

export default NewHome;

import { IAppInfo } from "@/models/AppInfo";
import React from "react";
import SwiperBlock from "./swiperBlock";
import { IItemBlock } from "@/models/stateChildrenApp";

const ListBlock = ({ appInfo, _state, listBlock }: { appInfo: IAppInfo; _state: string; listBlock?: IItemBlock[] }) => {
    return (
        <div className="bg-[#E6E9FD]">
            <div className="v4-container-component  v4-container-maxWidth">
                <div className="py-6 sm:py-12">
                    <h3 className="sm:leading-[60px] text-center font-bold text-2xlh sm:text-[40px]">
                        <span className=" capitalize">{_state}</span>{" "}
                        <span className=" uppercase">{appInfo.appShortName} </span> Basic Knowledge
                    </h3>
                    <h4 className="text-center mt-3 sm:mt-4 text-sm font-normal text-[#21212185] sm:text-[#212121] sm:text-lg">
                        Unlock the one-stop source for everything about <span className=" capitalize">{_state}</span>{" "}
                        <span className=" uppercase">{appInfo.appShortName} </span> with our expert blog! <br />
                        Packed with the ultimate guide to master the basics
                    </h4>

                    <ul className="mt-3 text-base font-medium list-disc sm:mt-4 hidden sm:flex w-full items-center gap-8 justify-center">
                        <li>
                            <span className=" capitalize">{_state}</span>{" "}
                            <span className=" uppercase">{appInfo.appShortName} </span> process
                        </li>
                        <li>Requirements & qualifications</li>
                        <li>Disqualifications</li>
                        <li>Career opportunities</li>
                        <li>Insider tips & updates</li>
                    </ul>
                    <p className="text-sm sm:text-2xl mt-3 sm:mt-6 text-center font-medium">
                        And much more! Click now to explore!
                    </p>
                    {listBlock?.length && listBlock?.length > 0 && <SwiperBlock listBlock={listBlock} />}
                </div>
            </div>
        </div>
    );
};

export default React.memo(ListBlock);

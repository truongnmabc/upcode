import React, { useEffect } from "react";
import "./ListState.scss";
import { getLink } from "@/utils";
import { IAppInfo } from "@/models/app/appInfo";
import { useIsMobile } from "@/hooks/useIsMobile";
import statesData from "@/data/statesName.json";
import { Collapse, Dialog } from "@mui/material";
import MyContainer from "@/components/v4-material/myContainer";

interface State {
    id: number;
    name: string;
    tag: string;
}

interface StatesData {
    [key: string]: State[];
}

const states: StatesData = statesData;

const ListState = ({
    appInfo,
    openListState,
    setOpenListState,
}: {
    appInfo: IAppInfo;
    openListState: boolean;
    setOpenListState: (e: boolean) => void;
}) => {
    const isMobile = useIsMobile();

    return isMobile ? (
        <>
            <Dialog
                open={openListState}
                onClose={() => setOpenListState(false)}
            >
                <div className="h-full overflow-auto ">
                    {states[appInfo.appShortName].map((state, index) => {
                        let _state = state.tag;
                        return (
                            <p
                                // href={getLink(appInfo, _state)}
                                className="w-full text-center py-2 px-6 cursor-pointer text-sm font-semibold transition-all "
                                key={index}
                                onClick={() => {
                                    localStorage.setItem(
                                        "select-state-" + appInfo.appNameId,
                                        _state
                                    );
                                    // ga.event({
                                    //     action: "click_state",
                                    //     params: {
                                    //         appShortName: appInfo.appShortName,
                                    //         state: state.name,
                                    //     },
                                    // });
                                }}
                            >
                                {state.name}
                            </p>
                        );
                    })}
                </div>
            </Dialog>
        </>
    ) : (
        <MyContainer className="py-4">
            <Collapse in={openListState} timeout="auto" unmountOnExit>
                <div className="w-full grid bg-[#212121b2] rounded-xl grid-cols-5 p-3 gap-2">
                    {states[appInfo.appShortName].map((state, index) => {
                        return (
                            <p
                                // href={getLink(appInfo, state.tag)}
                                onClick={() => {
                                    localStorage.setItem(
                                        "select-state-" + appInfo.appNameId,
                                        state.tag
                                    );
                                    // ga.event({
                                    //     action: "click_state",
                                    //     params: {
                                    //         appShortName: appInfo.appShortName,
                                    //         state: state.name,
                                    //     },
                                    // });
                                }}
                                className="w-full text-center py-2 cursor-pointer text-sm font-semibold transition-all hover:text-white hover:bg-[#ffffff1f] text-[#ffffffcc]"
                                key={index}
                            >
                                {state.name}
                            </p>
                        );
                    })}
                </div>
            </Collapse>
        </MyContainer>
    );
};

export default ListState;

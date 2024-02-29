import { IAppInfo } from "@/models/AppInfo";
import React, { useEffect } from "react";
import states from "../../data/statesName.json";
import "./ListState.scss";
import dynamic from "next/dynamic";
import { getLink } from "@/utils";
import * as ga from "../../services/ga";
const Dialog = dynamic(() => import("@mui/material/Dialog"));

const ListState = ({
    appInfo,
    isDesktop,
    openListState,
    setOpenListState,
}: {
    appInfo: IAppInfo;
    isDesktop: boolean;
    openListState: number;
    setOpenListState: any;
}) => {
    useEffect(() => {
        if (isDesktop && openListState == 1) {
            let cl = document.getElementById("collapse-list-state");
            let ls = document.getElementById("list-state-content");
            cl.style.height = ls.offsetHeight + "px";

            const clickEvent = (e: MouseEvent) => {
                if (e.target) {
                    if (!ls?.contains(e.target as Node)) {
                        cl.style.height = 0 + "px";
                        setTimeout(() => {
                            setOpenListState(0);
                        }, 400);
                    }
                }
            };

            window.addEventListener("mousedown", clickEvent);
            return () => {
                window.removeEventListener("mousedown", clickEvent);
            };
        }
    }, [openListState]);

    return isDesktop ? (
        <div id="collapse-list-state">
            <div className="select-state v4-border-radius" id="list-state-content">
                {states.map((state, index) => {
                    return (
                        <a
                            href={getLink(appInfo, state.toLowerCase().trim().replaceAll(" ", "-"))}
                            onClick={() => {
                                localStorage.setItem(
                                    "select-state-" + appInfo.appNameId,
                                    state.toLowerCase().trim().replaceAll(" ", "-")
                                );
                                ga.event({ action: "click_state", params: { state: state } });
                            }}
                            className="state"
                            key={index}
                        >
                            {state}
                        </a>
                    );
                })}
            </div>
        </div>
    ) : (
        <>
            <Dialog open={openListState == 1} onClose={() => setOpenListState(0)}>
                <div className="list-state-dialog overflow-auto">
                    {states.map((state, index) => {
                        return (
                            <a
                                href={getLink(appInfo, state.toLowerCase().trim().replaceAll(" ", "-"))}
                                className="state"
                                key={index}
                                onClick={() => {
                                    localStorage.setItem(
                                        "select-state-" + appInfo.appNameId,
                                        state.toLowerCase().trim().replaceAll(" ", "-")
                                    );
                                }}
                            >
                                {state}
                            </a>
                        );
                    })}
                </div>
            </Dialog>
        </>
    );
};

export default ListState;

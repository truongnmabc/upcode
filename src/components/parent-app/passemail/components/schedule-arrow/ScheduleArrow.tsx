import useThemeCustom from "@/components/v4-material/useThemeCustom";
import Config from "@/config";
import { IAppInfo } from "@/models/AppInfo";
import getRoutesFromStep from "@/utils/getRoutesFromStep";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect } from "react";
import * as ga from "../../../services/ga";
import "./ScheduleArrow.scss";
// import { isWebDMV } from "@/config/config_web";
// import { getLearnLinkDMV } from "../../../utils/utils_state";
const ScheduleArrow = ({
    callback,
    _state,
    currentStep = "",
    appInfo,
}: {
    callback: any;
    _state: string;
    currentStep?: string;
    appInfo: IAppInfo;
}) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isSmallMobile = useMediaQuery("(max-width: 374px)");
    const { theme } = useThemeCustom();
    const isLight = theme !== "dark";
    return (
        <div className="arrow-component-container">
            <StepItem
                isMobile={isMobile}
                isSmallMobile={isSmallMobile}
                callback={callback}
                appInfo={appInfo}
                label={"Step 1"}
                currentStep={currentStep}
                color1={"#2F8966"}
                color2={"rgba(34,168,117,0.76)"}
                _state={_state}
            />
            <ScheduleItem
                width={!isMobile ? 220 : isSmallMobile ? 87 : 100}
                currentStep={currentStep}
                appInfo={appInfo}
                _state={_state}
                color={isLight ? ([Config.STEP_DIAGNOSTICS_TEST].includes(currentStep) ? "#fff" : "#2F8966") : "#59FFBF"}
                backgroundColor={
                    [Config.STEP_DIAGNOSTICS_TEST].includes(currentStep)
                        ? isLight
                            ? "#2F8966"
                            : "rgba(255,255,255,0.4)"
                        : "linear-gradient(270deg," +
                          (isLight ? "#ffffff00 39.94%" : "rgba(255,255,255,0.12)") +
                          ", rgba(255, 255, 255, 0) 99.72%)"
                }
                label={"diagnostic test"}
                callback={callback}
                id={"diagnostic-test"}
                hoverBackground={isLight ? "#2F8966" : "rgba(255,255,255,0.4)"}
                hoverTextColor={isLight ? "#fff" : "#59FFBF"}
            />
            <StepItem
                isMobile={isMobile}
                isSmallMobile={isSmallMobile}
                callback={callback}
                appInfo={appInfo}
                currentStep={currentStep}
                label={"Step 2"}
                _state={_state}
                color1={"#2A9C9E"}
                color2={"rgba(30,161,164,0.74)"}
            />
            <ScheduleItem
                width={isMobile ? (isSmallMobile ? 75 : 84) : 204}
                _state={_state}
                appInfo={appInfo}
                color={
                    isLight
                        ? [Config.STEP_LEARNING, Config.STEP_LEARNING_DETAIL].includes(currentStep)
                            ? "#fff"
                            : "#2A9C9E"
                        : "#48FCFF"
                }
                backgroundColor={
                    [Config.STEP_LEARNING, Config.STEP_LEARNING_DETAIL].includes(currentStep)
                        ? isLight
                            ? "#2A9C9E"
                            : "rgba(255,255,255,0.4)"
                        : isLight
                        ? "#ffffff00"
                        : "rgba(255,255,255,0.12)"
                }
                label={"learning"}
                currentStep={currentStep}
                callback={callback}
                id={"learning"}
                hoverBackground={isLight ? "#2A9C9E" : "rgba(255,255,255,0.4)"}
                hoverTextColor={isLight ? "#fff" : "#48FCFF"}
            />
            <StepItem
                isMobile={isMobile}
                isSmallMobile={isSmallMobile}
                _state={_state}
                appInfo={appInfo}
                callback={callback}
                currentStep={currentStep}
                label={"Step 3"}
                color1={"rgba(0,100,140,0.88)"}
                color2={"rgba(5, 117, 162, 0.79)"}
            />
            <ScheduleItem
                width={isMobile ? (isSmallMobile ? 75 : 84) : 204}
                appInfo={appInfo}
                _state={_state}
                color={
                    isLight
                        ? [Config.STEP_FULL_TEST, Config.STEP_TEST_DETAIL].includes(currentStep)
                            ? "#fff"
                            : "rgba(0,100,140,0.88)"
                        : "#43CAFF"
                }
                backgroundColor={
                    [Config.STEP_FULL_TEST, Config.STEP_TEST_DETAIL].includes(currentStep)
                        ? isLight
                            ? "rgba(0,100,140,0.88)"
                            : "rgba(255,255,255,0.4)"
                        : isLight
                        ? "#ffffff00"
                        : "rgba(255,255,255,0.12)"
                }
                label={"full test"}
                callback={callback}
                currentStep={currentStep}
                id={"full-test"}
                hoverBackground={isLight ? "rgba(0,100,140,0.88)" : "rgba(255,255,255,0.4)"}
                hoverTextColor={isLight ? "#fff" : "#43CAFF"}
            />
            <StepItem
                isMobile={isMobile}
                isSmallMobile={isSmallMobile}
                appInfo={appInfo}
                callback={callback}
                currentStep={currentStep}
                _state={_state}
                label={"Pass"}
                color1={"#2F8966"}
                color2={"rgba(34,168,117,0.76)"}
            />
        </div>
    );
};

const ScheduleItem = ({
    width,
    color,
    label,
    left,
    right,
    backgroundColor,
    callback,
    id,
    hoverBackground,
    hoverTextColor,
    currentStep,
    _state,
    appInfo,
}: {
    appInfo: IAppInfo;
    width: number;
    color?: string;
    label?: string;
    left?: boolean;
    right?: boolean;
    backgroundColor: string;
    callback?: any;
    id?: string;
    hoverBackground?: string;
    hoverTextColor?: string;
    currentStep: string;
    _state: string;
}) => {
    let step = "";
    if (label === "diagnostic test") step = Config.STEP_DIAGNOSTICS_TEST;
    else if (label === "learning") step = Config.STEP_LEARNING;
    else if (label === "full test") step = Config.STEP_FULL_TEST;
    useEffect(() => {
        if (typeof window !== "undefined" && id) {
            document.getElementById(id + "-top").style.transition = "all 0.4s";
            document.getElementById(id + "-bottom").style.transition = "all 0.4s";
            document.getElementById(id + "-content").style.transition = "all 0.4s";
        }
    }, []);

    const onHover = () => {
        if (typeof window !== "undefined" && label && id) {
            document.getElementById(id + "-top").style.background = hoverBackground;
            document.getElementById(id + "-bottom").style.background = hoverBackground;
            document.getElementById(id + "-content").style.color = hoverTextColor;
        }
    };

    const onRelease = () => {
        if (typeof window !== "undefined" && label && id) {
            document.getElementById(id + "-top").style.background = backgroundColor;
            document.getElementById(id + "-bottom").style.background = backgroundColor;
            document.getElementById(id + "-content").style.color = color;
        }
    };

    const onClickArrow = () => {
        if (!step?.length) {
            return;
        }
        let action = "";
        const view = step.replace("STEP_", "").toLowerCase();
        if (currentStep === Config.HOME) {
            let lastActionName = "_click_home";
            if (appInfo?.hasState) {
                lastActionName = "_click_state";
            }
            action = view + lastActionName;
        }
        let url = "";
        if (appInfo.hasState) {
            url += "/" + _state;
        } else if (appInfo.appNameId) {
            url += "/" + appInfo.appNameId;
        }
        let routes = getRoutesFromStep(step);
        url += routes;

        // if (isWebDMV()) {
        //     url = getLearnLinkDMV(step);
        // }

        if (action) {
            ga.event({
                action,
                params: { step },
            });
        }
        callback(step, url);
    };

    return (
        <div
            className={"arrow-component-item" + (id && id !== "pass" ? " can-be-activate" : "")}
            style={{ width: width }}
            onClick={onClickArrow}
            onMouseOver={onHover}
            onMouseOut={onRelease}
        >
            <div
                className={"arrow top " + (left || right ? " gradient" : "")}
                style={{
                    background: backgroundColor,
                }}
                id={id + "-top"}
            >
                {left ? <div className="gradient-to-right-top"></div> : <></>}
                {right ? <div className="gradient-to-left-top"></div> : <></>}
            </div>

            <div className="content">
                <span className="item-label" style={{ color: color }} id={id + "-content"}>
                    {label}
                </span>
            </div>
            <div
                className={"arrow bottom " + (left || right ? " gradient" : "")}
                style={{
                    background: backgroundColor,
                }}
                id={id + "-bottom"}
            >
                {left ? <div className="gradient-to-right-bottom"></div> : <></>}
                {right ? <div className="gradient-to-left-bottom"></div> : <></>}
            </div>
        </div>
    );
};

const StepItem = ({
    isMobile,
    isSmallMobile,
    callback,
    label,
    color1,
    color2,
    currentStep,
    _state,
    appInfo,
}: {
    isMobile: boolean;
    isSmallMobile: boolean;
    callback: any;
    label: string;
    color1: string;
    color2: string;
    currentStep: string;
    _state: string;
    appInfo: IAppInfo;
}) => {
    return (
        <div style={{ display: "flex", position: "relative" }}>
            <ScheduleItem
                width={isMobile ? (isSmallMobile ? 9 : 12) : 25}
                appInfo={appInfo}
                backgroundColor={color1}
                label={""}
                left={true}
                _state={_state}
                callback={callback}
                currentStep={currentStep}
            />
            <div className="step-item">
                <ScheduleItem
                    width={isMobile ? (isSmallMobile ? 18 : 24) : 50}
                    appInfo={appInfo}
                    color={"#fff"}
                    _state={_state}
                    backgroundColor={"rgba(33, 33, 33, 0.3)"}
                    label={label}
                    callback={callback}
                    currentStep={currentStep}
                    id={label.toLocaleLowerCase() === "pass" ? "pass" : ""}
                />
            </div>

            <ScheduleItem
                width={isMobile ? (isSmallMobile ? 9 : 12) : 25}
                appInfo={appInfo}
                backgroundColor={color2}
                label={""}
                _state={_state}
                right={true}
                callback={callback}
                currentStep={currentStep}
            />
        </div>
    );
};
export default ScheduleArrow;

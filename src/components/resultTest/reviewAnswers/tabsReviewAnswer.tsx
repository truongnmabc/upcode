"use client";
import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/material/styles";

export const AntTabs = styled(Tabs)({
    borderBottom: "1px solid #e8e8e8",
    backgroundColor: "#E9E6D7",
    borderRadius: "8px",
    width: "100%",
    height: "40px",
    minHeight: "40px",
    padding: "4px 4px",
    "& .MuiTabs-indicator": {
        background: "white",
        color: "#7C6F5B",
        fontWeight: "500",
        with: "100%",
        height: "32px",
        borderRadius: "6px",
        border: "1px solid #fff",
        boxShadow: "0px 1px 2px 0px #0000000D",
        zIndex: 1,
    },
});

interface StyledTabProps {
    label: string;
}

export const AntTab = styled((props: StyledTabProps) => (
    <Tab disableRipple {...props} />
))(() => ({
    height: "32px",
    minHeight: "32px",
    width: "33%",
    padding: "4px 16px",
    fontSize: "16px",
    textTransform: "none",
    borderRadius: "6px",
    color: "#212121",
    position: "relative",
    zIndex: 2,
    "&.Mui-selected": {
        color: "#7C6F5B",
        fontWeight: "500",
    },
}));

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            // hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div className="flex flex-col gap-4">{children}</div>
            )}
        </div>
    );
}

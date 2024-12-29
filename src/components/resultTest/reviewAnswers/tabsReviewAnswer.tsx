"use client";
import React, { Fragment } from "react";
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
    index: number;
    value: number;
    data: ICurrentGame[];
}

import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";
import { ICurrentGame } from "@/models/game/game";
import QuestionResult from "./questionResult";
import { MyCrypto } from "@/utils/myCrypto";

export function CustomTabPanel(props: TabPanelProps) {
    const { value, index, data } = props;

    const getItemSize = (index: number) =>
        MyCrypto.decrypt(data[index]?.text)?.length > 240 ? 400 : 330;

    if (data.length === 0) return null;
    return (
        <Fragment>
            {value === index && (
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            height={height}
                            itemCount={1000}
                            itemSize={getItemSize}
                            width={width}
                            itemData={data}
                            className="scrollbar-none"
                        >
                            {Row}
                        </List>
                    )}
                </AutoSizer>
            )}
        </Fragment>
    );
}

const Row = ({
    index,
    style,
    data,
}: {
    index: number;
    style: React.CSSProperties;
    data: ICurrentGame[];
}) => {
    return (
        <div style={style} className="w-full py-2  h-full">
            <QuestionResult key={index} item={data[index]} />
        </div>
    );
};

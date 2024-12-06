"use client";

import { sendGAEvent, sendGTMEvent } from "@next/third-parties/google";

export const eventSendGtag = ({
    eventName,
    value,
}: {
    eventName: string;
    value: unknown;
}) => {
    if (process.env.NODE_ENV !== "development")
        sendGTMEvent({ event: eventName, value: value });
};

export const eventSendGA4 = ({
    eventName,
    value,
}: {
    eventName: string;
    value: unknown;
}) => {
    if (process.env.NODE_ENV !== "development")
        sendGAEvent("event", eventName, { value: value });
};

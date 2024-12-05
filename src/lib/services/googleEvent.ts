"use client";

import { sendGTMEvent, sendGAEvent } from "@next/third-parties/google";

export const eventSendGtag = ({
  eventName,
  value,
}: {
  eventName: string;
  value: any;
}) => {
  return;
  sendGTMEvent({ event: eventName, value: value });
};

export const eventSendGA4 = ({
  eventName,
  value,
  ...attr
}: {
  eventName: string;
  value: any;
}) => {
  return;
  sendGAEvent("event", eventName, { value: value });
};

"use client";
export const setSession = (key: string, value: unknown): void =>
    sessionStorage?.setItem(key, JSON.stringify(value));

export const getSession = (key: string) => {
    if (typeof setSession !== "undefined")
        return sessionStorage?.getItem(key) ?? "";
};

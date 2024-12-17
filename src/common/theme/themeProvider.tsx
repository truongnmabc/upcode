"use client";

import { appConfigState } from "@/redux/features/appConfig";
import { useAppSelector } from "@/redux/hooks";
import { createTheme, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useLayoutEffect } from "react";

export type ThemeMode = "light" | "dark" | "system";

const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { appConfig } = useAppSelector(appConfigState);
    const theme =
        (typeof localStorage !== "undefined" &&
            (localStorage?.getItem("theme") as ThemeMode)) ||
        "light";

    // setup màu mui ở đây, các thuộc tính màu sẽ thay đổi theo app

    const muiTheme = createTheme({
        palette: {
            primary: {
                main: "rgba(252, 167, 45, 1)",
            },
            mode: "light",
        },
    });

    useLayoutEffect(() => {
        if (appConfig) {
            console.log("🚀 ~ useLayoutEffect ~ appConfig:", appConfig);
            // setup property ở đây, các thuộc tính màu sẽ thay đổi theo app
            const root = window.document.documentElement;
            root.style.setProperty(
                "--main-background-color",
                appConfig.mainBackgroundColor
            );
        }
    }, [appConfig]);

    useLayoutEffect(() => {
        const root = window.document.body;

        if (theme === "dark") {
            root.classList.add("dark");
        }
        if (theme === "light") {
            root.classList.remove("dark");
        }
        if (theme === "system") {
            const mediaQuery = window.matchMedia(
                "(prefers-color-scheme: dark)"
            );
            if (mediaQuery.matches) {
                root.classList.add("dark");
            }

            const handleChange = (e: MediaQueryListEvent) => {
                if (e.matches) {
                    root.classList.add("dark");
                } else {
                    root.classList.remove("dark");
                }
            };

            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, [theme]);

    return (
        <AppRouterCacheProvider>
            <ThemeProvider theme={muiTheme}>
                {children}
                <CssBaseline />
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
};

export default AppThemeProvider;

"use client";
import { useColorScheme } from "@mui/material";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

export const useTheme = () => {
    const { setMode } = useColorScheme();
    const [theme, setTheme] = useState<string>("");
    useEffect(() => {
        const root = window.document.body;
        if (root.className && !theme) return;

        if (theme === "light") {
            root.classList.remove("dark");
        }

        if (theme === "dark") {
            root.classList.add("dark");
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
        return undefined;
    }, [theme]);

    const toggleTheme = (newTheme: ThemeMode) => {
        setTheme(newTheme);
        setMode(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return { theme, toggleTheme };
};

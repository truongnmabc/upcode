import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "var(--text-color-primary)",
            },
            backgroundColor: {
                "theme-white": "var(--main-background-color)",
                "theme-dark": "var(--main-background-color)",
            },
            fontFamily: {
                poppins: ["var(--font-poppins)"],
                vampiro: ["var(--font-vampiro)"],
            },
            boxShadow: {
                custom: "-4px 4px 8px 0px rgba(33, 33, 33, 0.16)",
                bottom: "0px -4px 8px 0px #21212129",
                close: "0px 0px 8px 0px #21212129",
            },
            width: {
                slider: "calc((100% / 3) - 16px)",
                "silder_2/3": "calc((100% / 2) - 24px)",
            },
        },
    },
    plugins: [],
} satisfies Config;

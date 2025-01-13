import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

const eslintConfig = [
    ...compat.config({
        extends: ["next/core-web-vitals", "next/typescript", "prettier"],
        rules: {
            "react/jsx-no-useless-fragment": "error",
        },
    }),
    {
        ignores: [
            "src/scripts/**",
            "src/components/sheet/**",
            "src/components/ripple/**",
            "src/components/parentApp/**",
            "src/components/initData/core/idb.js",
            "src/components/ads/check.tsx",
        ],
    },

    {
        files: ["**/*.ts", "**/*.tsx"],
        rules: {},
    },
];

export default eslintConfig;

import RouterApp from "@/common/router/router.constant";

export const convertPathName = (pathName: string): string => {
    const isSingleApp = process.env.IS_SINGLE_APP === "true";

    if (isSingleApp) return pathName;

    const pathParts = pathName.split("/").filter(Boolean);

    return pathParts.length > 1 ? `/${pathParts.slice(1).join("/")}` : "/";
};

export const revertPathName = ({
    href,
    appName,
    state = "all",
}: {
    href: string;
    appName: string;
    state?: string;
}): string => {
    const isSingleApp = process.env.IS_SINGLE_APP === "true";
    if (isSingleApp) return href;
    if (href === RouterApp.Home) return `/${appName}`;
    return `/${appName}/${state}/${href}`;
};

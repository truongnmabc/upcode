export const convertPathName = (pathName: string): string => {
  const isSingleApp = process.env.IS_SINGLE_APP === "true";

  if (isSingleApp) {
    return pathName;
  }

  const pathParts = pathName.split("/").filter(Boolean);

  return pathParts.length > 1 ? `/${pathParts.slice(1).join("/")}` : "/";
};

export const revertPathName = ({
  href,
  appName,
}: {
  href: string;
  appName?: string;
}): string => {
  const isSingleApp = process.env.IS_SINGLE_APP === "true";
  if (isSingleApp) {
    return href;
  }
  return `/${appName}/${href}`;
};

import path from "path";
import fs from "fs-extra";

const routerPath = "src/common/router/";
const pagePath = "src/app";

let RouterApp = {};
let appStackImports = "";
let appStackComponents = "";

const renderDefault = (item) => {
  return `
  const ${item?.name} = () => {
    return <div>${item?.name}</div>;
  }
  export default ${item?.name};`;
};

const renderAppStack = ({ appStackImports, appStackComponents }) => {
  return `
    import  { lazy } from "react";
    import RouterApp from "./router.constant.ts";
    
    ${appStackImports}
    
    export const APP_STACK =[ ${appStackComponents}];
  `;
};
const handleRouter = ({ item, defaultPath, routerObj, parentKey }) => {
  let componentContent = renderDefault(item);
  let componentPath = defaultPath + `/${item?.name}`;

  if (!fs.existsSync(componentPath)) {
    fs.mkdirSync(componentPath, { recursive: true });
    fs.writeFileSync(`${componentPath}/index.tsx`, componentContent);
    fs.mkdirSync(`${componentPath}/types`, { recursive: true });
    fs.mkdirSync(`${componentPath}/services`, { recursive: true });
    fs.mkdirSync(`${componentPath}/components`, { recursive: true });
    fs.writeFileSync(`${componentPath + "/types"}/index.ts`, "");
    fs.writeFileSync(`${componentPath + "/services"}/api.ts`, "");
  }

  if (!routerObj[item.name]) {
    routerObj[item.name] =
      item?.children?.length > 0
        ? {
            [item.name]: item.isIndex
              ? "/"
              : parentKey
              ? "/" + parentKey + "/" + item.name
              : "/" + item.name,
          }
        : item.isIndex
        ? "/"
        : parentKey
        ? "/" + parentKey + "/" + item.name
        : "/" + item.name;
  }
  const lazyName = componentPath?.replaceAll("/", "_");
  const lazyImport = `const Lazy${lazyName} = lazy(() => import("${componentPath?.replace(
    "src",
    "@"
  )}"));\n`;
  appStackImports += lazyImport;
  const parentKeyUpdate = `${item.name}`;

  const routeKey =
    item?.children?.length > 0 || parentKey
      ? `${parentKey || item?.name}.${item.name}`
      : `${item.name}`;

  const componentRoute = `{ path: RouterApp.${routeKey}, element: <Lazy${lazyName} /> },`;
  appStackComponents += `${componentRoute}\n`;

  if (item?.children?.length > 0) {
    fs.mkdirSync(`${componentPath}/pages`, { recursive: true });

    item?.children.forEach((child) => {
      handleRouter({
        item: child,
        defaultPath: `${componentPath}/pages`,
        routerObj: routerObj[item.name],
        parentKey: parentKeyUpdate,
      });
    });
  }
};

async function create() {
  try {
    const data = await fs.readFile(routerPath + "router.json", "utf-8");
    let list = JSON.parse(data);
    list.forEach((item) =>
      handleRouter({
        item: item,
        defaultPath: pagePath,
        routerObj: RouterApp,
      })
    );
    const routerAppContent = `
      const RouterApp = ${JSON.stringify(RouterApp, null, 2)};
      export default RouterApp;
    `;

    fs.writeFileSync(
      path.join(routerPath, "router.constant.ts"),
      routerAppContent
    );

    // const appStackContent = renderAppStack({
    //   appStackComponents,
    //   appStackImports,
    // });
    // fs.writeFileSync(path.join(routerPath, "listRouter.tsx"), appStackContent);
  } catch (err) {
    console.error("🚀 ~ create ~ err:", err);
  }
}

create();

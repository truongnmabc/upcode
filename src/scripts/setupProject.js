import { cancel, isCancel, select } from "@clack/prompts";
import fs from "fs";
import path from "path";
import {
  getDataAllApp,
  getDataSingleApp,
  getDataTopics,
} from "./setup/fetchData.js";
import { listTests } from "./setup/data.js";
import { getListApps } from "./setup/getListApps.js";
import {
  appendToEnvFile,
  _genStudyLink,
  saveJSONFile,
  copyFolder,
} from "./setup/utils.js";
import { createAndCheckoutBranch } from "./createAndCheckoutBranch.js";

const DATA_PATH = process.cwd();
const listAppState = ["cdl", "dmv", "real-estate"];
const envFilePath = path.join(DATA_PATH, ".env");
const BUCKET = "new-data-web/";
const BUCKET2 = "new-data-web-test/";

const runProcess = async () => {
  const names = await select({
    message: "Lựa chọn ứng dụng (Enter để lựa chọn)",
    options: [
      {
        value: 1,
        label: "Setup Single app",
      },
      {
        value: 2,
        label: "Setup Dynamic app",
      },
    ],
    required: true,
  });
  if (isCancel(names)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }
  switch (names) {
    case 1:
      setupSingleApp();
      break;
    case 2:
      setupDynamicApp();
      break;
    default:
      console.log("Invalid selection");
      break;
  }
};

runProcess();

const setupSingleApp = async () => {
  // const listApps = await getListApps();


    const newBranch = `setup-${new Date().getTime()}`
    createAndCheckoutBranch(newBranch)
  // const app = await select({
  //   message: "Lựa chọn ứng dụng (Enter để lựa chọn)",
  //   options: listApps,
  // });

  // const appInfo = await getDataSingleApp(app);
  // const isAppIncludesState = listAppState.includes(app);

  // const studyData = await getDataTopics({
  //   bucket: isAppIncludesState ? BUCKET : BUCKET2,
  //   state: isAppIncludesState ? "/" : "",
  //   appInfoBucket: appInfo[0].bucket,
  // });

  // const topics = studyData?.topics?.map((study) => ({
  //   ...study,
  //   url: _genStudyLink(appInfo[0].appShortName, study.tag, false),
  // }));

  // const data = {
  //   appId: appInfo[0].appId,
  //   topics: topics,
  //   tests: listTests,
  // };

  // saveJSONFile(
  //   path.join(DATA_PATH, "/src/common/data/dynamic/studyData.json"),
  //   data
  // );

  // copyFolder(
  //   path.join(DATA_PATH, "/src/app_root/pages"),
  //   path.join(DATA_PATH, "/src/app")
  // );

  // copyFolder(
  //   path.join(DATA_PATH, "/src/app_root/api"),
  //   path.join(DATA_PATH, "/src/app/api")
  // );

  // resetEnvFile(data?.appId);

  console.log("Setup completed successfully.");
};

const resetEnvFile = (appId) => {
  if (fs.existsSync(envFilePath)) fs.unlinkSync(envFilePath);

  appendToEnvFile("APP_ID", appId);
  appendToEnvFile("IS_SINGLE_APP", "true");
  appendToEnvFile("NEXT_PUBLIC_SECRET_KEY", "ABCElearning2022");
  appendToEnvFile("NEXT_PUBLIC_API_URL", "http://localhost:3000/");
};

const setupDynamicApp = async () => {
  // const listApp = await getDataAllApp();
  // console.log("🚀 ~ setupDynamicApp ~ listApp:", listApp);

  // saveJSONFile(
  //   path.join(DATA_PATH, "/src/common/data/dynamic/appInfos.json"),
  //   listApp
  // );
  // const appPath = path.join(DATA_PATH, "/src/app");
  // if (fs.existsSync(appPath)) {
  //   fs.rmdirSync(appPath, { recursive: true });
  // }
  // copyFolder(
  //   path.join(DATA_PATH, "/src/app_root/pages"),
  //   path.join(DATA_PATH, "/src/app/[appId]")
  // );

  // copyFolder(
  //   path.join(DATA_PATH, "/src/app_root/api"),
  //   path.join(DATA_PATH, "/src/app/api")
  // );
};

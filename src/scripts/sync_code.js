console.log("run ");
import path from "path";
import fs from "fs";
import { copyFolder } from "./setup/utils.js";

const ROOT_PATH = process.cwd();
const runScript = async () => {
  const appPath = path.join(ROOT_PATH, "/src/app_root");

  if (fs.existsSync(appPath)) {
    fs.rmdirSync(appPath, { recursive: true });
  }

  copyFolder(
    path.join(ROOT_PATH, "/src/app/[appId]"),
    path.join(ROOT_PATH, "/src/app_root/pages")
  );
  copyFolder(
    path.join(ROOT_PATH, "/src/app/api"),
    path.join(ROOT_PATH, "/src/app_root/api")
  );
};

runScript();

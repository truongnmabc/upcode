import { promises as fs } from "fs";
import path from "path";
import cache from "memory-cache";
import { timeCaching } from "@/common/constants";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params)?.slug;

  const cachingValue = cache.get(slug);
  if (cachingValue) {
    return Response.json({
      data: cachingValue,
      code: 200,
      message: "data caching",
      status: 1,
    });
  }
  const pathName = path.join(
    process.cwd(),
    "src/common/data/dynamic/appConfig.json"
  );
  try {
    const fileContent = await fs.readFile(pathName, "utf-8");
    const data = JSON.parse(fileContent);
    const currentAppInfo = data[slug];
    if (currentAppInfo) {
      cache.put(slug, currentAppInfo, timeCaching);

      return Response.json({
        data: currentAppInfo,
        code: 200,
        status: 1,
      });
    } else {
      return Response.json({
        data: "",
        code: 404,
        message: "AppId not founds",
        status: 0,
      });
    }
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return Response.json({ error: "Failed to read appInfos.json" });
  }
}

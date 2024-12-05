import { IAppInfo } from "@/lib/models/appInfo";
import { promises as fs } from "fs";
import path from "path";
import cache from "memory-cache";
import { timeCaching } from "@/common/constants";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug;
  const cachingValue = cache.get(`${slug}-seo`);
  if (cachingValue) {
    return Response.json({
      data: cachingValue,
      code: 200,
      message: "data caching",
      status: 1,
    });
  }
  //   const pathName = path.join(
  //     process.cwd(),
  //     "src/common/data/dynamic/appInfos.json"
  //   );
  try {
    // const res = await fetch;
    const currentAppInfo = {
      content: "",
    };
    if (true) {
      cache.put(`${slug}-seo`, currentAppInfo, timeCaching);
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
    return Response.json({ error: "Failed to read appInfos.json" });
  }
}

import { timeCaching } from "@/common/constants";
import cache from "memory-cache";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
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
    console.log("🚀 ~ error:", error);
    return Response.json({ error: "Failed to read appInfos.json" });
  }
}

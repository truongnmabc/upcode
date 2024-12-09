import { timeCaching } from "@/common/constants";
import { requestGetData } from "@/lib/services/request";
import cache from "memory-cache";
import { NextRequest } from "next/server";
export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ slug: string }>;
  }
) {
  const { nextUrl } = request;
  const search = nextUrl.searchParams.get("search");

  try {
    const slug = (await params).slug;

    const cachingValue = cache.get(search);
    if (cachingValue) {
      return Response.json({
        data: cachingValue,
        code: 200,
        message: "data caching",
        status: 1,
      });
    }

    const data = (await requestGetData({
      url: `/wp-json/passemall/v1/get-info-state?stateSlug=${slug}-${search}`,
      config: {
        baseURL: "https://api.asvab-prep.com",
      },
    })) as {
      content: string;
    };

    const currentAppInfo = {
      content: data?.content,
    };
    if (data) {
      cache.put(search, currentAppInfo, timeCaching);

      return Response.json({
        data: currentAppInfo,
        code: 200,
        status: 1,
      });
    } else {
      return Response.json({
        data: "",
        code: 404,
        message: "data not founds",
        status: 0,
      });
    }
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return Response.json({ error: "Failed to read appInfos.json" });
  }
}

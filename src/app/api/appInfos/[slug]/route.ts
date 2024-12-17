import { timeCaching } from "@/common/constants";
import { IAppInfo } from "@/models/app/appInfo";
import { promises as fs } from "fs";
import cache from "memory-cache";
import path from "path";
export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params)?.slug;
    if (!slug) throw new Error("");

    const cachingValue = cache.get(slug);
    if (cachingValue) {
        return Response.json({
            data: cachingValue,
            code: 200,
            message: "data caching",
            status: 1,
        });
    }
    const pathName = path.join(process.cwd(), "src/data/dynamic/appInfos.json");
    try {
        const fileContent = await fs.readFile(pathName, "utf-8");
        const data = JSON.parse(fileContent);
        const currentAppInfo = data?.find(
            (appInfo: IAppInfo) => appInfo.appShortName === slug
        );

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

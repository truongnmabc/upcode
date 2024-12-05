import { requestGetData } from "@/lib/services/request";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug;

  try {
    const data = await requestGetData({
      url: `/asvab/web-data/all-data.json?t=${new Date().getTime()}`,
      config: {
        baseURL:
          "https://storage.googleapis.com/micro-enigma-235001.appspot.com",
      },
    });
    return Response.json({
      data: data,
      code: 200,
      status: 1,
    });
  } catch (error) {
    return Response.json({ error: "Failed to read appInfos.json" });
  }
}

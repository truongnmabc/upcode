export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    return Response.json({
      data: "",
      code: 200,
      status: 1,
    });
  } catch (error) {
    console.log("🚀 ~ error:", error);

    return Response.json({ error: "Failed to read appInfos.json" });
  }
}

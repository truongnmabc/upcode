import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";

import { handlers } from "@/common/auth"; // Referring to the auth.ts we just created
export const { GET, POST } = handlers;

// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ slug: string }> }
// ) {
//   console.log("start auth secret", process.env.NEXT_PUBLIC_GOOGLE_SECRET);
//   console.log("start auth id", process.env.NEXT_PUBLIC_GOOGLE_ID);
//   const session = await getServerSession();
//   console.log("🚀 ~ session:", session);
//   try {
//     return Response.json({
//       data: "",
//       code: 200,
//       status: 1,
//     });
//   } catch (error) {
//     console.log("🚀 ~ error:", error);

//     return Response.json({ error: "Failed to read appInfos.json" });
//   }
// }

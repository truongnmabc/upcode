import { NextResponse, NextRequest } from "next/server";

export default function middleware(request: NextResponse) {
  console.log("🚀 ~ middleware ~ request:", request);
  // Middleware logic
}

// export const config = {
//   matcher: ["/asvab/"],
// };

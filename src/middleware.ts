import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const pathSegments = pathname.split("/").filter(Boolean);
    const slug = pathSegments[0];
    const subPath = pathSegments.slice(1).join("/");

    if (pathname === "/" && process.env.IS_SINGLE_APP === "true") {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = process.env.APP_SHORT_NAME;
        return NextResponse.redirect(redirectUrl);
    }

    const redirectPaths: string[] = [
        "score_calculator",
        "refund_policy",
        "terms-of-service",
        "privacy",
        "editorial-policy",
        "blog",
    ];

    // Kiểm tra subPath có trong danh sách không
    if (redirectPaths.includes(subPath)) {
        const redirectUrl = `https://${slug}-prep.com/${subPath}`;
        return NextResponse.redirect(redirectUrl);
    }

    // Không có redirect nào phù hợp, tiếp tục request
    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/:slug/:path*"],
};

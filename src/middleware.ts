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

    if (pathname === "/blog") {
        const redirectUrl = `https://${process.env.APP_SHORT_NAME}.com/blog`;
        return NextResponse.redirect(redirectUrl);
    }

    const redirectPaths: string[] = [
        "score-calculator",
        "refund-policy",
        "terms-of-service",
        "privacy",
        "editorial-policy",
        "blog",
    ];

    if (redirectPaths.includes(subPath)) {
        const redirectUrl = `https://${slug}-prep.com/${subPath}`;
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

export const config = {
    // matcher: ["/", "/:slug/:path*", "/blog"],
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the request matches the specific path
    if (pathname === "/asvab/score_calculator") {
        const redirectUrl = "https://asvab-prep.com/asvab-score-calculator";
        return NextResponse.redirect(redirectUrl);
    }
    if (pathname === "/asvab/refund_policy") {
        const redirectUrl = "https://asvab-prep.com/refund-policy";
        return NextResponse.redirect(redirectUrl);
    }
    if (pathname === "/asvab/terms-of-service") {
        const redirectUrl = "https://asvab-prep.com/terms-of-service";
        return NextResponse.redirect(redirectUrl);
    }
    if (pathname === "/asvab/privacy") {
        const redirectUrl = "https://asvab-prep.com/privacy";
        return NextResponse.redirect(redirectUrl);
    }
    if (pathname === "/asvab/editorial-policy") {
        const redirectUrl = "https://asvab-prep.com/editorial-policy";
        return NextResponse.redirect(redirectUrl);
    }
    if (pathname === "/asvab/blog") {
        const redirectUrl = "https://asvab-prep.com/blog";
        return NextResponse.redirect(redirectUrl);
    }
    // Proceed with default behavior if no match
    return NextResponse.next();
}

// Configure middleware to match the desired path
export const config = {
    matcher: [
        "/asvab/score_calculator",
        "/asvab/refund_policy",
        "/asvab/editorial-policy",
        "/asvab/privacy",
        "/asvab/terms-of-service",
        "/asvab/blog",
    ],
};

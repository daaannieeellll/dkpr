import { type MiddlewareFactory } from "./types";
import { type NextRequest, type NextMiddleware, type NextFetchEvent, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { protectedPaths } from "../../middleware";

export const withAuth: MiddlewareFactory = (next: NextMiddleware) => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
        const { pathname } = request.nextUrl;
        if (protectedPaths.some((path) => pathname.startsWith(path))) {
            const token = await getToken({ req: request });
            if (!token) {
                const url = new URL(`/api/auth/signin`, request.url);
                url.searchParams.set("callbackUrl ", encodeURI(request.url));
                return NextResponse.redirect(url);
            }
            // Skip the rest of the middleware stack and return the response
            return NextResponse.next();
        }
        return await next(request, _next);
    };
};

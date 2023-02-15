import type { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import type { MiddlewareFactory } from "./types";
import { NextResponse } from "next/server";
import { redis } from "../redis";

export const withURLShortener: MiddlewareFactory = (next: NextMiddleware) => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
        const path = request.nextUrl.pathname.slice(1);
        console.log({ path });
        const result = await redis.get<string>(path);
        if (result) {
            return NextResponse.redirect(result, 302);
        }
        return await next(request, _next);
    };
};
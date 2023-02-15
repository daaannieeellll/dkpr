import type { NextFetchEvent, NextRequest } from "next/server";
import type { MiddlewareFactory } from "./types";

export const withLogging: MiddlewareFactory = (next) => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
        console.log(request.url);
        return next(request, _next);
    };
};
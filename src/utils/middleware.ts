// middlewares/stackMiddlewares
import { type NextMiddleware, NextResponse } from "next/server";
import { type MiddlewareFactory } from "../server/middleware/types";

export function stackMiddleware(
    functions: MiddlewareFactory[] = []
): NextMiddleware {
    let next: NextMiddleware = () => NextResponse.next();
    for (const current of functions.reverse()) {
        next = current(next);
    }
    return next;
}
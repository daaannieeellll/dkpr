import { stackMiddleware } from "./utils/middleware";
import { withAuth } from "./server/middleware/auth";
import { withURLShortener } from "./server/middleware/urlshortener";
import { withLogging } from "./server/middleware/logging";

export default stackMiddleware([withLogging, withAuth, withURLShortener]);

export const config = {
    matcher: ['/((?!api|_next/static|favicon.ico).*)', '/'],
};

export const protectedPaths = [
    "/admin",
];
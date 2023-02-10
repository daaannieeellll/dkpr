import { withAuth } from "next-auth/middleware"

export default withAuth(
    function middleware(req) {
        // Do something with the request
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
)

export const config = { matcher: ["/test"] }
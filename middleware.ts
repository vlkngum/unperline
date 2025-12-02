import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth

    if (req.nextUrl.pathname.startsWith("/api/protected") && !isLoggedIn) {
        return Response.redirect(new URL("/", req.nextUrl))
    }

    return null
})

export const config = {
    matcher: ["/api/protected/:path*"], 
}

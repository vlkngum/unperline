import { auth } from "@/auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAuthPage =
        req.nextUrl.pathname.startsWith("/login") ||
        req.nextUrl.pathname.startsWith("/register");

    if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/", req.nextUrl));
    }

    if (!isAuthPage && !isLoggedIn) {
        return Response.redirect(new URL("/login", req.nextUrl));
    }

    return null;
});

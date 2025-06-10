import { verifyJWT } from "@/lib/auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    if(req.nextUrl.pathname.startsWith("/_next") 
        || req.nextUrl.pathname.startsWith('/refresh')) {
        return NextResponse.next();
    }

    if(!req.nextUrl.pathname.startsWith("/login") &&
      !req.nextUrl.pathname.startsWith("/signup")) {
        // check jwt
        const token = req.cookies.get("token")?.value;
        const url = new URL('/login', req.nextUrl.origin);
        let tokenResponse;
        if(!token ||
          !(tokenResponse = await verifyJWT(token))) {
            console.log("buh");
            return NextResponse.redirect(url);
        } 
    }
    return NextResponse.next();
}


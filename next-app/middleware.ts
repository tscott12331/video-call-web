import { verifyJWT } from "@/lib/auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    if(req.nextUrl.pathname.startsWith("/_next") 
        || req.nextUrl.pathname.startsWith('/refresh')) {
        return NextResponse.next();
    }

    const token = req.cookies.get("token")?.value;
    const authenticated = token && await verifyJWT(token);
    if(!req.nextUrl.pathname.startsWith("/login") &&
      !req.nextUrl.pathname.startsWith("/signup")) {
        // check jwt
        
        if(!authenticated) {
            return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
        } 
    } else if(authenticated) {
        return NextResponse.redirect(new URL('/', req.nextUrl.origin));
    }
    return NextResponse.next();
}


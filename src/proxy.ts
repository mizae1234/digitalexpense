import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE = 'session';

async function isValidToken(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return typeof payload.userId === 'string' && typeof payload.role === 'string';
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const isAuth = await isValidToken(token, secret);
  const path = req.nextUrl.pathname;

  if (path === '/login') {
    if (isAuth) return NextResponse.redirect(new URL('/', req.url));
    return NextResponse.next();
  }

  if (!isAuth) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.).*)'],
};

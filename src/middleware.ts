import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin' || request.nextUrl.pathname === '/admin/') {
    return NextResponse.rewrite(new URL('/admin/index.html', request.url));
  }
}

export const config = {
  matcher: ['/admin', '/admin/'],
};

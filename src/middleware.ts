import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // If the request is using the 'default' pseudo-locale, redirect to /fr/
  if (request.nextUrl.locale === 'default') {
    const locale = 'fr';
    return NextResponse.redirect(
      new URL(`/${locale}${request.nextUrl.pathname}${request.nextUrl.search}`, request.url),
    );
  }
}

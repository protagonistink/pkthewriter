import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  if (
    process.env.NODE_ENV === 'production' &&
    request.nextUrl.pathname.startsWith('/studio')
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: '/studio/:path*' }

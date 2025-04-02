import { NextResponse } from 'next/server'

export function middleware() {
  const response = NextResponse.next()

  // Only add headers if DISSALLOW_ALL_RULE is set
  if (process.env.DISSALLOW_ALL_RULE === 'true') {
    // Add headers to prevent indexing
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    )
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  return response
}

export const config = {
  matcher: '/:path*',
}

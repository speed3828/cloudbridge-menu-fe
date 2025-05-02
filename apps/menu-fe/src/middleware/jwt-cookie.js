import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

/**
 * Middleware to handle JWT cookie setting
 * @param {NextRequest} request - The incoming Next.js request
 * @returns {NextResponse} - The modified response
 */
export function middleware(request) {
  const response = NextResponse.next()
  
  // Set cookie domain
  response.cookies.set({
    name: 'jwt',
    value: request.cookies.get('jwt')?.value || '',
    domain: '.autoriseinsight.co.kr',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  })

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 
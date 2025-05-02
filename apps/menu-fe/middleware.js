import { NextResponse } from 'next/server'

/**
 * Middleware function for Next.js request handling
 * @param {import('next/server').NextRequest} request - The incoming request
 * @returns {import('next/server').NextResponse} - The response
 */
export function middleware(request) {
  const response = NextResponse.next()

  // Set cookie domain for JWT
  const token = request.cookies.get('jwt')
  if (token) {
    response.cookies.set('jwt', token.value, {
      domain: '.autoriseinsight.co.kr',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
  }

  return response
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
} 
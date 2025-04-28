import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
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
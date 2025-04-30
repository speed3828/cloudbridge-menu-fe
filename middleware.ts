import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { csrfMiddleware, setCSRFToken } from '@/middleware/csrf'
import { defaultRateLimit } from '@/middleware/rateLimit'

export function middleware(request: NextRequest) {
  // Rate Limiting 적용
  const rateLimitResponse = defaultRateLimit(request)
  if (rateLimitResponse.status !== 200) {
    return rateLimitResponse
  }

  // CSRF 보호 적용
  const csrfResponse = csrfMiddleware(request)
  if (csrfResponse.status !== 200) {
    return csrfResponse
  }

  const response = NextResponse.next()

  // Set cookie domain for JWT
  const token = request.cookies.get('jwt')
  if (token) {
    const domain = process.env.COOKIE_DOMAIN || '.autoriseinsight.co.kr'
    response.cookies.set('jwt', token.value, {
      domain,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      httpOnly: true
    })
  }

  // CSRF 토큰 설정
  return setCSRFToken(response)
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
} 
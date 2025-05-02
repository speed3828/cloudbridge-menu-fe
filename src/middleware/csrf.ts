import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CSRF_TOKEN_COOKIE = 'csrf_token';
const CSRF_HEADER = 'X-CSRF-Token';

export function generateCSRFToken(): string {
  // Edge Runtime compatible crypto API (works in both Edge and Node.js environments)
  const array = new Uint8Array(32);
  
  // crypto is available in all Next.js environments (including Edge)
  crypto.getRandomValues(array);
  
  // Convert to hex string
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function csrfMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  // GET 요청은 CSRF 검사 제외
  if (request.method === 'GET') {
    return response;
  }

  // CSRF 토큰 검증
  const csrfToken = request.cookies.get(CSRF_TOKEN_COOKIE)?.value;
  const headerToken = request.headers.get(CSRF_HEADER);

  if (!csrfToken || !headerToken || csrfToken !== headerToken) {
    return new NextResponse(
      JSON.stringify({ message: 'CSRF 토큰이 유효하지 않습니다.' }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return response;
}

export function setCSRFToken(response: NextResponse): NextResponse {
  const token = generateCSRFToken();
  response.cookies.set(CSRF_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
  return response;
} 
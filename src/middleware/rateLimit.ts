// 임시 타입 정의
interface NextRequest {
  ip?: string;
  headers: Headers;
  // 필요한 경우 추가 속성 정의
}

class NextResponse {
  headers: Headers;
  status: number;
  
  constructor(body: any, init?: {status?: number, headers?: any}) {
    this.status = init?.status || 200;
    this.headers = new Headers(init?.headers);
  }
  
  static json(body: any, init?: {status?: number, headers?: any}) {
    return new NextResponse(JSON.stringify(body), init);
  }
  
  static next() {
    return new NextResponse(null);
  }
}

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function rateLimit(config: RateLimitConfig) {
  return function rateLimitMiddleware(request: NextRequest) {
    const ip = request.ip || 'anonymous';
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // 이전 요청 정보 초기화
    if (!store[ip] || store[ip].resetTime < windowStart) {
      store[ip] = {
        count: 0,
        resetTime: now,
      };
    }

    // 요청 카운트 증가
    store[ip].count++;

    // 요청 제한 초과 시
    if (store[ip].count > config.max) {
      return NextResponse.json(
        {
          message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
        },
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(config.windowMs / 1000).toString(),
          },
        }
      );
    }

    return NextResponse.next();
  };
}

// 기본 설정
export const defaultRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1분
  max: 100, // 최대 100회 요청
}); 
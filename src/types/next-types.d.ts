declare module 'next/server' {
  import { IncomingMessage, ServerResponse } from 'http';
  
  export interface NextRequest extends IncomingMessage {
    ip?: string;
    url: string;
    // 필요한 경우 추가 속성 정의
  }
  
  export class NextResponse {
    static json(body: any, init?: ResponseInit): NextResponse;
    static next(options?: { rewrite?: string; }): NextResponse;
    static redirect(url: string, init?: ResponseInit): NextResponse;
    static rewrite(url: string, init?: ResponseInit): NextResponse;
    
    constructor(body?: BodyInit | null, init?: ResponseInit);
    
    // 필요한 메서드 추가
    headers: Headers;
    status: number;
    statusText: string;
  }
} 
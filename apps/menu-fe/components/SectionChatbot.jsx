'use client';

import React from 'react';

export default function SectionChatbot({ url }) {
  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] shadow-lg rounded-lg overflow-hidden">
      <iframe
        src={url}
        className="w-full h-full border-0"
        allow="microphone; camera"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        title="메뉴 섹션 챗봇"
        aria-label="메뉴 섹션 챗봇 - 메뉴 관련 질문에 답변해드립니다"
      />
    </div>
  );
} 
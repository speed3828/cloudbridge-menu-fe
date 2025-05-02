import React from 'react'

/**
 * 섹션 챗봇 컴포넌트
 * @param {Object} props - 컴포넌트 프롭스
 * @param {string} props.url - 챗봇 URL
 */
const SectionChatbot = ({ url }) => {
  return (
    <div className="fixed bottom-4 right-4">
      <iframe
        src={url}
        className="w-96 h-[600px] border-0 rounded-lg shadow-lg"
        title="Chatbot"
      />
    </div>
  )
}

export default SectionChatbot 
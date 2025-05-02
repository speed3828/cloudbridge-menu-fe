import React from 'react'

interface SectionChatbotProps {
  url: string
}

function SectionChatbot({ url }: SectionChatbotProps): JSX.Element {
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
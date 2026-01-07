// src/components/ai-course-generation/ChatMessage.tsx
import React from 'react';
import { ConversationMessage } from '../../interfaces/aiCourseGeneration';
import { User, Bot, Loader2 } from 'lucide-react';

interface ChatMessageProps {
  message: ConversationMessage;
  isTyping?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isTyping = false }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex gap-3 mb-6 animate-fadeIn ${
        isUser ? 'flex-row-reverse' : ''
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-[#446D6D] to-[#5a8a8a]'
            : 'bg-gradient-to-br from-purple-500 to-purple-600'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isUser ? 'flex justify-end' : ''}`}>
        <div
          className={`max-w-[75%] rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gradient-to-r from-[#446D6D] to-[#5a8a8a] text-white'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {isTyping ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">AI is thinking...</span>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}
          {!isTyping && message.timestamp && (
            <p
              className={`text-xs mt-2 opacity-70 ${
                isUser ? 'text-white/80' : 'text-gray-500'
              }`}
            >
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


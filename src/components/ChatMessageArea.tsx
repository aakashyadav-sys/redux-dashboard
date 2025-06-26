import React, { useEffect, useRef } from 'react';
import { ChatMessage, ChatParticipant } from '../types';

interface ChatMessageAreaProps {
  messages: ChatMessage[];
  currentUser: ChatParticipant;
  onAddReaction: (messageId: string, emoji: string) => void;
}

const ChatMessageArea: React.FC<ChatMessageAreaProps> = ({
  messages,
  currentUser,
  onAddReaction
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const shouldShowDateSeparator = (currentMessage: ChatMessage, previousMessage?: ChatMessage) => {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.timestamp).toDateString();
    const previousDate = new Date(previousMessage.timestamp).toDateString();
    
    return currentDate !== previousDate;
  };

  const shouldShowAvatar = (currentMessage: ChatMessage, nextMessage?: ChatMessage) => {
    if (currentMessage.senderId === currentUser.id) return false;
    if (!nextMessage) return true;
    
    return currentMessage.senderId !== nextMessage.senderId;
  };

  const shouldShowSenderName = (currentMessage: ChatMessage, previousMessage?: ChatMessage) => {
    if (currentMessage.senderId === currentUser.id) return false;
    if (!previousMessage) return true;
    
    return currentMessage.senderId !== previousMessage.senderId;
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start the conversation</h3>
          <p className="text-gray-600">Send a message to get things started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      <div className="space-y-4">
        {messages.map((message, index) => {
          const previousMessage = index > 0 ? messages[index - 1] : undefined;
          const nextMessage = index < messages.length - 1 ? messages[index + 1] : undefined;
          const isCurrentUser = message.senderId === currentUser.id;
          const showDateSeparator = shouldShowDateSeparator(message, previousMessage);
          const showAvatar = shouldShowAvatar(message, nextMessage);
          const showSenderName = shouldShowSenderName(message, previousMessage);

          return (
            <div key={message.id}>
              {/* Date Separator */}
              {showDateSeparator && (
                <div className="flex items-center justify-center my-6">
                  <div className="bg-white px-4 py-2 rounded-full shadow-sm border text-sm text-gray-600 font-medium">
                    {formatDate(message.timestamp)}
                  </div>
                </div>
              )}

              {/* Message */}
              <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>
                <div className={`flex max-w-xs lg:max-w-md ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                  {/* Avatar */}
                  {!isCurrentUser && (
                    <div className={`flex-shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                      <img
                        src={message.senderAvatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'}
                        alt={message.senderName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                  )}

                  {/* Message Content */}
                  <div className={`${isCurrentUser ? 'mr-2' : 'ml-2'}`}>
                    {/* Sender Name */}
                    {showSenderName && !isCurrentUser && (
                      <div className="text-xs text-gray-600 mb-1 px-3">
                        {message.senderName}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`relative px-4 py-2 rounded-2xl ${
                        isCurrentUser
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                      } shadow-sm`}
                    >
                      <p className="text-sm leading-relaxed break-words">{message.content}</p>
                      
                      {/* Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.reactions.map((reaction) => (
                            <button
                              key={reaction.id}
                              onClick={() => onAddReaction(message.id, reaction.emoji)}
                              className="inline-flex items-center px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
                              title={`${reaction.userName} reacted with ${reaction.emoji}`}
                            >
                              <span className="mr-1">{reaction.emoji}</span>
                              <span className="text-gray-600">1</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className={`text-xs text-gray-500 mt-1 px-3 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                      {formatTime(message.timestamp)}
                      {isCurrentUser && (
                        <span className="ml-2">
                          {message.isRead ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessageArea;
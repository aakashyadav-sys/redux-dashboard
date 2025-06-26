import React from 'react';
import { Users, User } from 'lucide-react';
import { ChatConversation } from '../types';

interface ChatConversationListProps {
  conversations: ChatConversation[];
  activeConversation: string | null;
  onSelectConversation: (id: string) => void;
}

const ChatConversationList: React.FC<ChatConversationListProps> = ({
  conversations,
  activeConversation,
  onSelectConversation
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getConversationAvatar = (conversation: ChatConversation) => {
    if (conversation.type === 'group') {
      return conversation.avatar || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2';
    } else {
      const otherParticipant = conversation.participants.find(p => p.id !== 'current-user');
      return otherParticipant?.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2';
    }
  };

  const getLastSeenText = (conversation: ChatConversation) => {
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants.find(p => p.id !== 'current-user');
      if (otherParticipant?.isOnline) {
        return 'Online';
      } else if (otherParticipant?.lastSeen) {
        const lastSeen = new Date(otherParticipant.lastSeen);
        const now = new Date();
        const diffInMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
        
        if (diffInMinutes < 60) {
          return `${Math.floor(diffInMinutes)}m ago`;
        } else if (diffInMinutes < 1440) {
          return `${Math.floor(diffInMinutes / 60)}h ago`;
        } else {
          return `${Math.floor(diffInMinutes / 1440)}d ago`;
        }
      }
    } else {
      const onlineCount = conversation.participants.filter(p => p.isOnline && p.id !== 'current-user').length;
      return `${onlineCount} online`;
    }
    return '';
  };

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
          <p className="text-gray-600">Start a new conversation to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => onSelectConversation(conversation.id)}
          className={`p-4 cursor-pointer hover:bg-white transition-colors border-b border-gray-100 ${
            activeConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
          }`}
        >
          <div className="flex items-start space-x-3">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={getConversationAvatar(conversation)}
                alt={conversation.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {conversation.type === 'group' ? (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                  <Users size={10} />
                </div>
              ) : (
                conversation.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                )
              )}
            </div>

            {/* Conversation Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className={`text-sm truncate ${
                  conversation.unreadCount > 0 ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                }`}>
                  {conversation.name}
                </h4>
                <div className="flex items-center space-x-2">
                  {conversation.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessage.timestamp)}
                    </span>
                  )}
                  {conversation.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p className={`text-sm truncate ${
                  conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                }`}>
                  {conversation.lastMessage ? (
                    <>
                      {conversation.lastMessage.senderId === 'current-user' && 'You: '}
                      {conversation.lastMessage.content}
                    </>
                  ) : (
                    'No messages yet'
                  )}
                </p>
              </div>
              
              <div className="mt-1">
                <span className="text-xs text-gray-500">
                  {getLastSeenText(conversation)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatConversationList;
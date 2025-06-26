import React from 'react';
import { Phone, Video, MoreVertical, ArrowLeft, Users, User } from 'lucide-react';
import { ChatConversation } from '../types';

interface ChatHeaderProps {
  conversation: ChatConversation;
  onBack?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation, onBack }) => {
  const getConversationAvatar = () => {
    if (conversation.type === 'group') {
      return conversation.avatar || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2';
    } else {
      const otherParticipant = conversation.participants.find(p => p.id !== 'current-user');
      return otherParticipant?.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2';
    }
  };

  const getStatusText = () => {
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants.find(p => p.id !== 'current-user');
      if (otherParticipant?.isOnline) {
        return 'Online';
      } else if (otherParticipant?.lastSeen) {
        const lastSeen = new Date(otherParticipant.lastSeen);
        const now = new Date();
        const diffInMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
        
        if (diffInMinutes < 60) {
          return `Last seen ${Math.floor(diffInMinutes)}m ago`;
        } else if (diffInMinutes < 1440) {
          return `Last seen ${Math.floor(diffInMinutes / 60)}h ago`;
        } else {
          return `Last seen ${Math.floor(diffInMinutes / 1440)}d ago`;
        }
      }
      return 'Offline';
    } else {
      const totalMembers = conversation.participants.length;
      const onlineMembers = conversation.participants.filter(p => p.isOnline).length;
      return `${totalMembers} members, ${onlineMembers} online`;
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Back Button (Mobile) */}
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          {/* Avatar */}
          <div className="relative">
            <img
              src={getConversationAvatar()}
              alt={conversation.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {conversation.type === 'group' ? (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                <Users size={8} />
              </div>
            ) : (
              conversation.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )
            )}
          </div>

          {/* Conversation Info */}
          <div>
            <h3 className="font-semibold text-gray-900">{conversation.name}</h3>
            <p className="text-sm text-gray-600">{getStatusText()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Phone size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Video size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
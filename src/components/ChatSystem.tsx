import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Search, Phone, Video, MoreVertical, Smile, Paperclip, Users, UserPlus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { setActiveConversation, sendMessage, addReaction } from '../store/chatSlice';
import ChatConversationList from './ChatConversationList';
import ChatMessageArea from './ChatMessageArea';
import ChatHeader from './ChatHeader';

const ChatSystem: React.FC = () => {
  const dispatch = useAppDispatch();
  const { conversations, messages, activeConversation, currentUser } = useAppSelector(state => state.chat);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const activeConv = conversations.find(c => c.id === activeConversation);
  const activeMessages = activeConversation ? messages[activeConversation] || [] : [];

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim() && activeConversation) {
      dispatch(sendMessage({
        conversationId: activeConversation,
        content: messageInput.trim()
      }));
      setMessageInput('');
      messageInputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
    messageInputRef.current?.focus();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalUnreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Sidebar - Conversations List */}
      <div className={`${isMobileView && activeConversation ? 'hidden' : 'flex'} w-full md:w-80 flex-col border-r border-gray-200 bg-gray-50`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <MessageCircle className="mr-2 h-6 w-6 text-blue-600" />
              Messages
              {totalUnreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {totalUnreadCount}
                </span>
              )}
            </h2>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <UserPlus size={18} />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ChatConversationList
          conversations={filteredConversations}
          activeConversation={activeConversation}
          onSelectConversation={(id) => dispatch(setActiveConversation(id))}
        />
      </div>

      {/* Main Chat Area */}
      <div className={`${isMobileView && !activeConversation ? 'hidden' : 'flex'} flex-1 flex flex-col`}>
        {activeConv ? (
          <>
            {/* Chat Header */}
            <ChatHeader
              conversation={activeConv}
              onBack={isMobileView ? () => dispatch(setActiveConversation(null)) : undefined}
            />

            {/* Messages Area */}
            <ChatMessageArea
              messages={activeMessages}
              currentUser={currentUser}
              onAddReaction={(messageId, emoji) => {
                if (activeConversation) {
                  dispatch(addReaction({ conversationId: activeConversation, messageId, emoji }));
                }
              }}
            />

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip size={20} />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    ref={messageInputRef}
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Smile size={20} />
                  </button>
                  
                  {showEmojiPicker && (
                    <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
                      <div className="grid grid-cols-6 gap-2">
                        {['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🎉', '😢', '😮', '😡', '🔥'].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleEmojiSelect(emoji)}
                            className="p-2 hover:bg-gray-100 rounded text-lg"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSystem;
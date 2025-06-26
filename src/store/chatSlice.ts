import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatState, ChatConversation, ChatMessage, ChatParticipant } from '../types';

const currentUser: ChatParticipant = {
  id: 'current-user',
  name: 'You',
  avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
  isOnline: true
};

const initialConversations: ChatConversation[] = [
  {
    id: 'conv-1',
    name: 'Alice Johnson',
    type: 'direct',
    participants: [
      currentUser,
      {
        id: 'alice',
        name: 'Alice Johnson',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        isOnline: true,
        role: 'member'
      }
    ],
    unreadCount: 2,
    isOnline: true
  },
  {
    id: 'conv-2',
    name: 'Project Team',
    type: 'group',
    participants: [
      currentUser,
      {
        id: 'bob',
        name: 'Bob Smith',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        isOnline: false,
        lastSeen: '2024-01-20T10:30:00Z',
        role: 'admin'
      },
      {
        id: 'carol',
        name: 'Carol Davis',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        isOnline: true,
        role: 'member'
      },
      {
        id: 'david',
        name: 'David Wilson',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        isOnline: true,
        role: 'member'
      }
    ],
    unreadCount: 0,
    avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
  },
  {
    id: 'conv-3',
    name: 'Eva Brown',
    type: 'direct',
    participants: [
      currentUser,
      {
        id: 'eva',
        name: 'Eva Brown',
        avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        isOnline: false,
        lastSeen: '2024-01-19T15:45:00Z',
        role: 'member'
      }
    ],
    unreadCount: 0,
    isOnline: false
  },
  {
    id: 'conv-4',
    name: 'Design Team',
    type: 'group',
    participants: [
      currentUser,
      {
        id: 'alice',
        name: 'Alice Johnson',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        isOnline: true,
        role: 'admin'
      },
      {
        id: 'sarah',
        name: 'Sarah Wilson',
        avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        isOnline: true,
        role: 'member'
      }
    ],
    unreadCount: 1,
    avatar: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
  }
];

const initialMessages: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      senderId: 'alice',
      senderName: 'Alice Johnson',
      senderAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      content: 'Hey! How are you doing with the new project requirements?',
      timestamp: '2024-01-20T09:30:00Z',
      type: 'text',
      isRead: false
    },
    {
      id: 'msg-2',
      senderId: 'current-user',
      senderName: 'You',
      content: 'Going well! I\'ve finished the initial analysis. Should have the draft ready by tomorrow.',
      timestamp: '2024-01-20T09:35:00Z',
      type: 'text',
      isRead: true
    },
    {
      id: 'msg-3',
      senderId: 'alice',
      senderName: 'Alice Johnson',
      senderAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      content: 'Perfect! Let me know if you need any clarification on the technical specs.',
      timestamp: '2024-01-20T10:15:00Z',
      type: 'text',
      isRead: false
    }
  ],
  'conv-2': [
    {
      id: 'msg-4',
      senderId: 'bob',
      senderName: 'Bob Smith',
      senderAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      content: 'Team meeting scheduled for 2 PM today. Please review the agenda I shared.',
      timestamp: '2024-01-20T08:00:00Z',
      type: 'text',
      isRead: true
    },
    {
      id: 'msg-5',
      senderId: 'carol',
      senderName: 'Carol Davis',
      senderAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      content: 'Sounds good! I\'ll prepare the frontend updates presentation.',
      timestamp: '2024-01-20T08:15:00Z',
      type: 'text',
      isRead: true
    },
    {
      id: 'msg-6',
      senderId: 'david',
      senderName: 'David Wilson',
      senderAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      content: 'API documentation is ready for review. I\'ll share the link in the meeting.',
      timestamp: '2024-01-20T08:30:00Z',
      type: 'text',
      isRead: true
    }
  ],
  'conv-3': [
    {
      id: 'msg-7',
      senderId: 'eva',
      senderName: 'Eva Brown',
      senderAvatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      content: 'Thanks for helping with the database optimization yesterday!',
      timestamp: '2024-01-19T16:00:00Z',
      type: 'text',
      isRead: true
    },
    {
      id: 'msg-8',
      senderId: 'current-user',
      senderName: 'You',
      content: 'No problem! The query performance should be much better now.',
      timestamp: '2024-01-19T16:05:00Z',
      type: 'text',
      isRead: true
    }
  ],
  'conv-4': [
    {
      id: 'msg-9',
      senderId: 'alice',
      senderName: 'Alice Johnson',
      senderAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      content: 'New design mockups are ready for review. Check the shared folder.',
      timestamp: '2024-01-20T11:00:00Z',
      type: 'text',
      isRead: false
    },
    {
      id: 'msg-10',
      senderId: 'sarah',
      senderName: 'Sarah Wilson',
      senderAvatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      content: 'Great work! The color scheme looks much better now.',
      timestamp: '2024-01-20T11:15:00Z',
      type: 'text',
      isRead: true
    }
  ]
};

// Update conversations with last messages
initialConversations.forEach(conv => {
  const messages = initialMessages[conv.id];
  if (messages && messages.length > 0) {
    conv.lastMessage = messages[messages.length - 1];
  }
});

const initialState: ChatState = {
  conversations: initialConversations,
  messages: initialMessages,
  activeConversation: null,
  currentUser,
  loading: false,
  error: null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversation = action.payload;
      // Mark messages as read when conversation is opened
      if (action.payload && state.messages[action.payload]) {
        state.messages[action.payload].forEach(message => {
          if (message.senderId !== state.currentUser.id) {
            message.isRead = true;
          }
        });
        // Reset unread count
        const conversation = state.conversations.find(c => c.id === action.payload);
        if (conversation) {
          conversation.unreadCount = 0;
        }
      }
    },
    sendMessage: (state, action: PayloadAction<{ conversationId: string; content: string }>) => {
      const { conversationId, content } = action.payload;
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: state.currentUser.id,
        senderName: state.currentUser.name,
        senderAvatar: state.currentUser.avatar,
        content,
        timestamp: new Date().toISOString(),
        type: 'text',
        isRead: true
      };

      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(newMessage);

      // Update last message in conversation
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.lastMessage = newMessage;
      }
    },
    markAsRead: (state, action: PayloadAction<{ conversationId: string; messageId: string }>) => {
      const { conversationId, messageId } = action.payload;
      const message = state.messages[conversationId]?.find(m => m.id === messageId);
      if (message) {
        message.isRead = true;
      }
    },
    addReaction: (state, action: PayloadAction<{ conversationId: string; messageId: string; emoji: string }>) => {
      const { conversationId, messageId, emoji } = action.payload;
      const message = state.messages[conversationId]?.find(m => m.id === messageId);
      if (message) {
        if (!message.reactions) {
          message.reactions = [];
        }
        const existingReaction = message.reactions.find(r => r.userId === state.currentUser.id && r.emoji === emoji);
        if (existingReaction) {
          // Remove reaction if it already exists
          message.reactions = message.reactions.filter(r => !(r.userId === state.currentUser.id && r.emoji === emoji));
        } else {
          // Add new reaction
          message.reactions.push({
            id: `reaction-${Date.now()}`,
            userId: state.currentUser.id,
            userName: state.currentUser.name,
            emoji
          });
        }
      }
    },
    updateUserStatus: (state, action: PayloadAction<{ userId: string; isOnline: boolean }>) => {
      const { userId, isOnline } = action.payload;
      state.conversations.forEach(conversation => {
        const participant = conversation.participants.find(p => p.id === userId);
        if (participant) {
          participant.isOnline = isOnline;
          if (!isOnline) {
            participant.lastSeen = new Date().toISOString();
          }
        }
        if (conversation.type === 'direct' && conversation.participants.some(p => p.id === userId)) {
          conversation.isOnline = isOnline;
        }
      });
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  setActiveConversation,
  sendMessage,
  markAsRead,
  addReaction,
  updateUserStatus,
  setLoading,
  setError
} = chatSlice.actions;

export default chatSlice.reducer;
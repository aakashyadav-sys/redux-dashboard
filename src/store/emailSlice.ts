import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EmailState, Email } from '../types';

const initialEmails: Email[] = [
  {
    id: '1',
    from: 'john.doe@company.com',
    to: 'me@company.com',
    subject: 'Project Update - Q4 Planning',
    body: '<p>Hi there,</p><p>I wanted to give you an update on our Q4 planning progress. We\'ve completed the initial requirements gathering and are now moving into the design phase.</p><p>Key highlights:</p><ul><li>Requirements finalized</li><li>Team assignments completed</li><li>Timeline approved by stakeholders</li></ul><p>Let me know if you have any questions.</p><p>Best regards,<br>John</p>',
    timestamp: '2024-01-20T10:30:00Z',
    isRead: false,
    isStarred: true,
    isImportant: true,
    folder: 'inbox'
  },
  {
    id: '2',
    from: 'sarah.wilson@company.com',
    to: 'me@company.com',
    subject: 'Meeting Reminder: Design Review',
    body: '<p>Hello,</p><p>This is a friendly reminder about our design review meeting scheduled for tomorrow at 2:00 PM.</p><p>Agenda items:</p><ol><li>UI/UX mockup review</li><li>Technical feasibility discussion</li><li>Timeline adjustments</li></ol><p>Please come prepared with your feedback on the latest designs.</p><p>Thanks,<br>Sarah</p>',
    timestamp: '2024-01-20T09:15:00Z',
    isRead: true,
    isStarred: false,
    isImportant: false,
    folder: 'inbox'
  },
  {
    id: '3',
    from: 'mike.johnson@company.com',
    to: 'me@company.com',
    subject: 'Budget Approval Request',
    body: '<p>Hi,</p><p>I need your approval for the additional budget allocation for the new project. The details are as follows:</p><p><strong>Requested Amount:</strong> $15,000<br><strong>Purpose:</strong> Additional development resources<br><strong>Timeline:</strong> Q1 2024</p><p>Please review and let me know your decision by end of week.</p><p>Best,<br>Mike</p>',
    timestamp: '2024-01-19T16:45:00Z',
    isRead: true,
    isStarred: false,
    isImportant: true,
    folder: 'inbox'
  },
  {
    id: '4',
    from: 'hr@company.com',
    to: 'me@company.com',
    subject: 'New Employee Onboarding',
    body: '<p>Dear Team Lead,</p><p>We have a new team member joining us next Monday. Please ensure the following are ready:</p><ul><li>Workspace setup</li><li>System access credentials</li><li>Welcome package</li><li>First week schedule</li></ul><p>The new employee details will be shared separately.</p><p>HR Team</p>',
    timestamp: '2024-01-19T11:20:00Z',
    isRead: false,
    isStarred: false,
    isImportant: false,
    folder: 'inbox'
  },
  {
    id: '5',
    from: 'me@company.com',
    to: 'team@company.com',
    subject: 'Weekly Team Update',
    body: '<p>Hi Team,</p><p>Here\'s our weekly progress update:</p><p><strong>Completed:</strong></p><ul><li>Database migration</li><li>API endpoints testing</li><li>UI component library update</li></ul><p><strong>In Progress:</strong></p><ul><li>Frontend integration</li><li>Performance optimization</li></ul><p><strong>Next Week:</strong></p><ul><li>User testing</li><li>Bug fixes</li><li>Documentation update</li></ul><p>Great work everyone!</p>',
    timestamp: '2024-01-18T17:00:00Z',
    isRead: true,
    isStarred: false,
    isImportant: false,
    folder: 'sent'
  }
];

const initialState: EmailState = {
  emails: initialEmails,
  selectedEmail: null,
  loading: false,
  error: null
};

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    sendEmail: (state, action: PayloadAction<Omit<Email, 'id' | 'timestamp' | 'folder'>>) => {
      const newEmail: Email = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        folder: 'sent'
      };
      state.emails.push(newEmail);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const email = state.emails.find(email => email.id === action.payload);
      if (email) {
        email.isRead = true;
      }
    },
    markAsUnread: (state, action: PayloadAction<string>) => {
      const email = state.emails.find(email => email.id === action.payload);
      if (email) {
        email.isRead = false;
      }
    },
    toggleStar: (state, action: PayloadAction<string>) => {
      const email = state.emails.find(email => email.id === action.payload);
      if (email) {
        email.isStarred = !email.isStarred;
      }
    },
    toggleImportant: (state, action: PayloadAction<string>) => {
      const email = state.emails.find(email => email.id === action.payload);
      if (email) {
        email.isImportant = !email.isImportant;
      }
    },
    deleteEmail: (state, action: PayloadAction<string>) => {
      const email = state.emails.find(email => email.id === action.payload);
      if (email) {
        email.folder = 'trash';
      }
    },
    selectEmail: (state, action: PayloadAction<Email | null>) => {
      state.selectedEmail = action.payload;
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
  sendEmail,
  markAsRead,
  markAsUnread,
  toggleStar,
  toggleImportant,
  deleteEmail,
  selectEmail,
  setLoading,
  setError
} = emailSlice.actions;

export default emailSlice.reducer;
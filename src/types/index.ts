export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'date' | 'tel';
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

export interface DataItem {
  id: string;
  [key: string]: any;
}

export interface DataState {
  items: DataItem[];
  loading: boolean;
  error: string | null;
}

export interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  assignee: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  description?: string;
  dependencies?: string[];
}

export interface GanttState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  attachments?: string[];
  folder: 'inbox' | 'sent' | 'drafts' | 'trash';
}

export interface EmailState {
  emails: Email[];
  selectedEmail: Email | null;
  loading: boolean;
  error: string | null;
}

export interface DynamicFormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface DynamicForm {
  id: string;
  title: string;
  description?: string;
  fields: DynamicFormField[];
  createdAt: string;
  updatedAt: string;
  submissions: FormSubmission[];
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
}

export interface DynamicFormsState {
  forms: DynamicForm[];
  selectedForm: DynamicForm | null;
  loading: boolean;
  error: string | null;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  isRead: boolean;
  reactions?: ChatReaction[];
}

export interface ChatReaction {
  id: string;
  userId: string;
  userName: string;
  emoji: string;
}

export interface ChatConversation {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants: ChatParticipant[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
  role?: 'admin' | 'member';
}

export interface ChatState {
  conversations: ChatConversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversation: string | null;
  currentUser: ChatParticipant;
  loading: boolean;
  error: string | null;
}
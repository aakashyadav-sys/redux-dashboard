import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  cards: KanbanCard[];
  limit?: number;
}

export interface KanbanState {
  columns: KanbanColumn[];
  loading: boolean;
  error: string | null;
}

const initialColumns: KanbanColumn[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: '#6b7280',
    cards: [
      {
        id: 'card-1',
        title: 'User Authentication System',
        description: 'Implement login, registration, and password reset functionality',
        assignee: 'Alice Johnson',
        priority: 'High',
        dueDate: '2024-02-15',
        tags: ['Backend', 'Security'],
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z'
      },
      {
        id: 'card-2',
        title: 'Database Schema Design',
        description: 'Design and implement the database schema for the application',
        assignee: 'Bob Smith',
        priority: 'Critical',
        dueDate: '2024-02-10',
        tags: ['Database', 'Architecture'],
        createdAt: '2024-01-19T14:30:00Z',
        updatedAt: '2024-01-19T14:30:00Z'
      },
      {
        id: 'card-3',
        title: 'API Documentation',
        description: 'Create comprehensive API documentation using OpenAPI/Swagger',
        assignee: 'Carol Davis',
        priority: 'Medium',
        tags: ['Documentation', 'API'],
        createdAt: '2024-01-18T09:15:00Z',
        updatedAt: '2024-01-18T09:15:00Z'
      }
    ]
  },
  {
    id: 'todo',
    title: 'To Do',
    color: '#3b82f6',
    cards: [
      {
        id: 'card-4',
        title: 'Responsive Design Implementation',
        description: 'Make the application fully responsive across all devices',
        assignee: 'David Wilson',
        priority: 'High',
        dueDate: '2024-02-20',
        tags: ['Frontend', 'CSS'],
        createdAt: '2024-01-17T16:45:00Z',
        updatedAt: '2024-01-17T16:45:00Z'
      },
      {
        id: 'card-5',
        title: 'Unit Test Coverage',
        description: 'Increase unit test coverage to 90%',
        assignee: 'Eva Brown',
        priority: 'Medium',
        dueDate: '2024-02-25',
        tags: ['Testing', 'Quality'],
        createdAt: '2024-01-16T11:20:00Z',
        updatedAt: '2024-01-16T11:20:00Z'
      }
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: '#f59e0b',
    cards: [
      {
        id: 'card-6',
        title: 'Payment Integration',
        description: 'Integrate Stripe payment gateway for subscription management',
        assignee: 'Alice Johnson',
        priority: 'Critical',
        dueDate: '2024-02-12',
        tags: ['Payment', 'Integration'],
        createdAt: '2024-01-15T13:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z'
      },
      {
        id: 'card-7',
        title: 'Performance Optimization',
        description: 'Optimize application performance and reduce load times',
        assignee: 'Bob Smith',
        priority: 'High',
        tags: ['Performance', 'Optimization'],
        createdAt: '2024-01-14T10:45:00Z',
        updatedAt: '2024-01-19T12:15:00Z'
      }
    ]
  },
  {
    id: 'review',
    title: 'Review',
    color: '#8b5cf6',
    cards: [
      {
        id: 'card-8',
        title: 'Email Notification System',
        description: 'Implement email notifications for important events',
        assignee: 'Carol Davis',
        priority: 'Medium',
        dueDate: '2024-02-08',
        tags: ['Email', 'Notifications'],
        createdAt: '2024-01-13T08:30:00Z',
        updatedAt: '2024-01-18T14:20:00Z'
      }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    color: '#10b981',
    cards: [
      {
        id: 'card-9',
        title: 'Project Setup',
        description: 'Initial project setup with React, TypeScript, and Tailwind CSS',
        assignee: 'David Wilson',
        priority: 'High',
        tags: ['Setup', 'Configuration'],
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-12T17:00:00Z'
      },
      {
        id: 'card-10',
        title: 'Design System',
        description: 'Create a comprehensive design system and component library',
        assignee: 'Eva Brown',
        priority: 'Medium',
        tags: ['Design', 'Components'],
        createdAt: '2024-01-08T14:15:00Z',
        updatedAt: '2024-01-15T16:30:00Z'
      }
    ]
  }
];

const initialState: KanbanState = {
  columns: initialColumns,
  loading: false,
  error: null
};

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    moveCard: (state, action: PayloadAction<{
      cardId: string;
      sourceColumnId: string;
      destinationColumnId: string;
      sourceIndex: number;
      destinationIndex: number;
    }>) => {
      const { cardId, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex } = action.payload;
      
      const sourceColumn = state.columns.find(col => col.id === sourceColumnId);
      const destinationColumn = state.columns.find(col => col.id === destinationColumnId);
      
      if (!sourceColumn || !destinationColumn) return;
      
      const card = sourceColumn.cards[sourceIndex];
      if (!card) return;
      
      // Remove card from source column
      sourceColumn.cards.splice(sourceIndex, 1);
      
      // Add card to destination column
      destinationColumn.cards.splice(destinationIndex, 0, {
        ...card,
        updatedAt: new Date().toISOString()
      });
    },
    addCard: (state, action: PayloadAction<{
      columnId: string;
      card: Omit<KanbanCard, 'id' | 'createdAt' | 'updatedAt'>;
    }>) => {
      const { columnId, card } = action.payload;
      const column = state.columns.find(col => col.id === columnId);
      
      if (column) {
        const newCard: KanbanCard = {
          ...card,
          id: `card-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        column.cards.push(newCard);
      }
    },
    updateCard: (state, action: PayloadAction<{
      columnId: string;
      cardId: string;
      updates: Partial<KanbanCard>;
    }>) => {
      const { columnId, cardId, updates } = action.payload;
      const column = state.columns.find(col => col.id === columnId);
      
      if (column) {
        const cardIndex = column.cards.findIndex(card => card.id === cardId);
        if (cardIndex !== -1) {
          column.cards[cardIndex] = {
            ...column.cards[cardIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
      }
    },
    deleteCard: (state, action: PayloadAction<{
      columnId: string;
      cardId: string;
    }>) => {
      const { columnId, cardId } = action.payload;
      const column = state.columns.find(col => col.id === columnId);
      
      if (column) {
        column.cards = column.cards.filter(card => card.id !== cardId);
      }
    },
    addColumn: (state, action: PayloadAction<Omit<KanbanColumn, 'cards'>>) => {
      const newColumn: KanbanColumn = {
        ...action.payload,
        cards: []
      };
      state.columns.push(newColumn);
    },
    updateColumn: (state, action: PayloadAction<{
      columnId: string;
      updates: Partial<KanbanColumn>;
    }>) => {
      const { columnId, updates } = action.payload;
      const columnIndex = state.columns.findIndex(col => col.id === columnId);
      
      if (columnIndex !== -1) {
        state.columns[columnIndex] = {
          ...state.columns[columnIndex],
          ...updates
        };
      }
    },
    deleteColumn: (state, action: PayloadAction<string>) => {
      state.columns = state.columns.filter(col => col.id !== action.payload);
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
  moveCard,
  addCard,
  updateCard,
  deleteCard,
  addColumn,
  updateColumn,
  deleteColumn,
  setLoading,
  setError
} = kanbanSlice.actions;

export default kanbanSlice.reducer;
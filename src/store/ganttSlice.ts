import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GanttState, Task } from '../types';

const initialTasks: Task[] = [
  {
    id: '1',
    name: 'Project Planning & Requirements',
    startDate: '2024-01-15',
    endDate: '2024-01-30',
    progress: 100,
    assignee: 'Alice Johnson',
    priority: 'High',
    status: 'Completed',
    description: 'Define project scope, requirements, and initial planning',
    dependencies: []
  },
  {
    id: '2',
    name: 'UI/UX Design Phase',
    startDate: '2024-01-25',
    endDate: '2024-02-15',
    progress: 85,
    assignee: 'Bob Smith',
    priority: 'High',
    status: 'In Progress',
    description: 'Create wireframes, mockups, and design system',
    dependencies: ['1']
  },
  {
    id: '3',
    name: 'Frontend Development',
    startDate: '2024-02-10',
    endDate: '2024-03-20',
    progress: 60,
    assignee: 'Carol Davis',
    priority: 'Critical',
    status: 'In Progress',
    description: 'Implement React components and user interface',
    dependencies: ['2']
  },
  {
    id: '4',
    name: 'Backend API Development',
    startDate: '2024-02-01',
    endDate: '2024-03-10',
    progress: 75,
    assignee: 'David Wilson',
    priority: 'Critical',
    status: 'In Progress',
    description: 'Build REST APIs and database integration',
    dependencies: ['1']
  },
  {
    id: '5',
    name: 'Database Setup & Migration',
    startDate: '2024-01-30',
    endDate: '2024-02-10',
    progress: 100,
    assignee: 'Eva Brown',
    priority: 'Medium',
    status: 'Completed',
    description: 'Set up database schema and initial data migration',
    dependencies: ['1']
  },
  {
    id: '6',
    name: 'Integration Testing',
    startDate: '2024-03-15',
    endDate: '2024-04-05',
    progress: 20,
    assignee: 'Alice Johnson',
    priority: 'High',
    status: 'Not Started',
    description: 'Test frontend and backend integration',
    dependencies: ['3', '4']
  },
  {
    id: '7',
    name: 'User Acceptance Testing',
    startDate: '2024-04-01',
    endDate: '2024-04-20',
    progress: 0,
    assignee: 'Bob Smith',
    priority: 'Medium',
    status: 'Not Started',
    description: 'Conduct user testing and gather feedback',
    dependencies: ['6']
  },
  {
    id: '8',
    name: 'Deployment & Launch',
    startDate: '2024-04-15',
    endDate: '2024-04-30',
    progress: 0,
    assignee: 'Carol Davis',
    priority: 'Critical',
    status: 'Not Started',
    description: 'Deploy to production and launch application',
    dependencies: ['7']
  }
];

const initialState: GanttState = {
  tasks: initialTasks,
  loading: false,
  error: null
};

const ganttSlice = createSlice({
  name: 'gantt',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString()
      };
      state.tasks.push(newTask);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    updateTaskProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      const task = state.tasks.find(task => task.id === action.payload.id);
      if (task) {
        task.progress = action.payload.progress;
        if (action.payload.progress === 100) {
          task.status = 'Completed';
        } else if (action.payload.progress > 0) {
          task.status = 'In Progress';
        }
      }
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
  addTask, 
  updateTask, 
  deleteTask, 
  updateTaskProgress, 
  setLoading, 
  setError 
} = ganttSlice.actions;
export default ganttSlice.reducer;
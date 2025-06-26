import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataState, DataItem } from '../types';

const initialItems: DataItem[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    salary: 95000,
    startDate: '2023-01-15'
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@company.com',
    phone: '+1 (555) 234-5678',
    department: 'Marketing',
    salary: 72000,
    startDate: '2023-03-20'
  },
  {
    id: '3',
    firstName: 'Carol',
    lastName: 'Davis',
    email: 'carol.davis@company.com',
    phone: '+1 (555) 345-6789',
    department: 'Sales',
    salary: 68000,
    startDate: '2023-02-10'
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@company.com',
    phone: '+1 (555) 456-7890',
    department: 'HR',
    salary: 65000,
    startDate: '2023-04-05'
  },
  {
    id: '5',
    firstName: 'Eva',
    lastName: 'Brown',
    email: 'eva.brown@company.com',
    phone: '+1 (555) 567-8901',
    department: 'Finance',
    salary: 78000,
    startDate: '2023-01-30'
  }
];

const initialState: DataState = {
  items: initialItems,
  loading: false,
  error: null
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<DataItem, 'id'>>) => {
      const newItem: DataItem = {
        ...action.payload,
        id: Date.now().toString()
      };
      state.items.push(newItem);
    },
    updateItem: (state, action: PayloadAction<DataItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { addItem, updateItem, deleteItem, setLoading, setError } = dataSlice.actions;
export default dataSlice.reducer;
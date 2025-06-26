import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './dataSlice';
import ganttReducer from './ganttSlice';
import emailReducer from './emailSlice';
import dynamicFormsReducer from './dynamicFormsSlice';
import chatReducer from './chatSlice';
import visualizeReducer from './visualizeSlice';

export const store = configureStore({
  reducer: {
    data: dataReducer,
    gantt: ganttReducer,
    email: emailReducer,
    dynamicForms: dynamicFormsReducer,
    chat: chatReducer,
    visualize: visualizeReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
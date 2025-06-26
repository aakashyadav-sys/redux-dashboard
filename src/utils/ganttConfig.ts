import { FormField } from '../types';

export const taskFormFields: FormField[] = [
  {
    name: 'name',
    label: 'Task Name',
    type: 'text',
    required: true,
    placeholder: 'Enter task name'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'text',
    placeholder: 'Enter task description'
  },
  {
    name: 'assignee',
    label: 'Assignee',
    type: 'select',
    required: true,
    options: ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Eva Brown']
  },
  {
    name: 'startDate',
    label: 'Start Date',
    type: 'date',
    required: true
  },
  {
    name: 'endDate',
    label: 'End Date',
    type: 'date',
    required: true
  },
  {
    name: 'priority',
    label: 'Priority',
    type: 'select',
    required: true,
    options: ['Low', 'Medium', 'High', 'Critical']
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: ['Not Started', 'In Progress', 'Completed', 'On Hold']
  }
];
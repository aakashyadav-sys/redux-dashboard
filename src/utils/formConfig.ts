import { FormField } from '../types';

export const formFields: FormField[] = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    required: true,
    placeholder: 'Enter first name'
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    required: true,
    placeholder: 'Enter last name'
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'Enter email address'
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'tel',
    placeholder: 'Enter phone number'
  },
  {
    name: 'department',
    label: 'Department',
    type: 'select',
    required: true,
    options: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations']
  },
  {
    name: 'salary',
    label: 'Salary',
    type: 'number',
    placeholder: 'Enter salary'
  },
  {
    name: 'startDate',
    label: 'Start Date',
    type: 'date',
    required: true
  }
];
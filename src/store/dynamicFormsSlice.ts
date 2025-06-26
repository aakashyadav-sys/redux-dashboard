import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DynamicFormsState, DynamicForm, FormSubmission } from '../types';

const initialForms: DynamicForm[] = [
  {
    id: '1',
    title: 'Customer Feedback Form',
    description: 'Collect customer feedback and suggestions',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        required: true
      },
      {
        id: 'rating',
        type: 'select',
        label: 'Overall Rating',
        required: true,
        options: ['Excellent', 'Good', 'Average', 'Poor']
      },
      {
        id: 'feedback',
        type: 'textarea',
        label: 'Your Feedback',
        placeholder: 'Please share your thoughts...',
        required: true
      },
      {
        id: 'recommend',
        type: 'radio',
        label: 'Would you recommend us?',
        required: true,
        options: ['Yes', 'No', 'Maybe']
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    submissions: [
      {
        id: 'sub1',
        formId: '1',
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          rating: 'Excellent',
          feedback: 'Great service and support!',
          recommend: 'Yes'
        },
        submittedAt: '2024-01-16T14:30:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'Event Registration',
    description: 'Register for upcoming events',
    fields: [
      {
        id: 'firstName',
        type: 'text',
        label: 'First Name',
        required: true
      },
      {
        id: 'lastName',
        type: 'text',
        label: 'Last Name',
        required: true
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email',
        required: true
      },
      {
        id: 'phone',
        type: 'text',
        label: 'Phone Number',
        required: false
      },
      {
        id: 'eventType',
        type: 'select',
        label: 'Event Type',
        required: true,
        options: ['Workshop', 'Seminar', 'Conference', 'Networking']
      },
      {
        id: 'dietary',
        type: 'checkbox',
        label: 'Special Dietary Requirements',
        required: false
      },
      {
        id: 'comments',
        type: 'textarea',
        label: 'Additional Comments',
        placeholder: 'Any special requests or comments...',
        required: false
      }
    ],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    submissions: []
  }
];

const initialState: DynamicFormsState = {
  forms: initialForms,
  selectedForm: null,
  loading: false,
  error: null
};

const dynamicFormsSlice = createSlice({
  name: 'dynamicForms',
  initialState,
  reducers: {
    createForm: (state, action: PayloadAction<Omit<DynamicForm, 'id' | 'createdAt' | 'updatedAt' | 'submissions'>>) => {
      const newForm: DynamicForm = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        submissions: []
      };
      state.forms.push(newForm);
    },
    updateForm: (state, action: PayloadAction<DynamicForm>) => {
      const index = state.forms.findIndex(form => form.id === action.payload.id);
      if (index !== -1) {
        state.forms[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString()
        };
      }
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.forms = state.forms.filter(form => form.id !== action.payload);
      if (state.selectedForm?.id === action.payload) {
        state.selectedForm = null;
      }
    },
    selectForm: (state, action: PayloadAction<DynamicForm | null>) => {
      state.selectedForm = action.payload;
    },
    submitForm: (state, action: PayloadAction<{ formId: string; data: Record<string, any> }>) => {
      const form = state.forms.find(f => f.id === action.payload.formId);
      if (form) {
        const submission: FormSubmission = {
          id: Date.now().toString(),
          formId: action.payload.formId,
          data: action.payload.data,
          submittedAt: new Date().toISOString()
        };
        form.submissions.push(submission);
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
  createForm,
  updateForm,
  deleteForm,
  selectForm,
  submitForm,
  setLoading,
  setError
} = dynamicFormsSlice.actions;

export default dynamicFormsSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TeamNode {
  id: string;
  name: string;
  role: string;
  department: string;
  managerId?: string;
  avatar: string;
  email: string;
  joinDate: string;
}

export interface JobNode {
  id: string;
  title: string;
  department: string;
  level: string;
  parentJobId?: string;
  requirements: string[];
  responsibilities: string[];
  salary: number;
  openPositions: number;
}

export interface FormNode {
  id: string;
  title: string;
  category: string;
  parentFormId?: string;
  fields: number;
  submissions: number;
  createdAt: string;
  status: 'active' | 'draft' | 'archived';
}

export interface VisualizeState {
  teams: TeamNode[];
  jobs: JobNode[];
  forms: FormNode[];
  activeView: 'teams' | 'jobs' | 'forms';
  loading: boolean;
  error: string | null;
}

const initialTeams: TeamNode[] = [
  {
    id: 'ceo-1',
    name: 'John Smith',
    role: 'CEO',
    department: 'Executive',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    email: 'john.smith@company.com',
    joinDate: '2020-01-15'
  },
  {
    id: 'cto-1',
    name: 'Sarah Johnson',
    role: 'CTO',
    department: 'Technology',
    managerId: 'ceo-1',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    email: 'sarah.johnson@company.com',
    joinDate: '2020-03-20'
  },
  {
    id: 'cmo-1',
    name: 'Mike Davis',
    role: 'CMO',
    department: 'Marketing',
    managerId: 'ceo-1',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    email: 'mike.davis@company.com',
    joinDate: '2020-05-10'
  },
  {
    id: 'eng-lead-1',
    name: 'Alice Wilson',
    role: 'Engineering Lead',
    department: 'Engineering',
    managerId: 'cto-1',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    email: 'alice.wilson@company.com',
    joinDate: '2021-01-15'
  },
  {
    id: 'dev-1',
    name: 'Bob Brown',
    role: 'Senior Developer',
    department: 'Engineering',
    managerId: 'eng-lead-1',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    email: 'bob.brown@company.com',
    joinDate: '2021-06-20'
  },
  {
    id: 'dev-2',
    name: 'Carol Green',
    role: 'Frontend Developer',
    department: 'Engineering',
    managerId: 'eng-lead-1',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    email: 'carol.green@company.com',
    joinDate: '2022-02-10'
  },
  {
    id: 'marketing-lead-1',
    name: 'David White',
    role: 'Marketing Lead',
    department: 'Marketing',
    managerId: 'cmo-1',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    email: 'david.white@company.com',
    joinDate: '2021-03-15'
  },
  {
    id: 'marketing-1',
    name: 'Eva Black',
    role: 'Marketing Specialist',
    department: 'Marketing',
    managerId: 'marketing-lead-1',
    avatar: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    email: 'eva.black@company.com',
    joinDate: '2022-01-20'
  }
];

const initialJobs: JobNode[] = [
  {
    id: 'job-1',
    title: 'Chief Executive Officer',
    department: 'Executive',
    level: 'C-Level',
    requirements: ['MBA', '15+ years leadership', 'Strategic vision'],
    responsibilities: ['Company strategy', 'Board relations', 'Executive decisions'],
    salary: 250000,
    openPositions: 0
  },
  {
    id: 'job-2',
    title: 'Chief Technology Officer',
    department: 'Technology',
    level: 'C-Level',
    parentJobId: 'job-1',
    requirements: ['Computer Science degree', '12+ years tech leadership', 'Architecture expertise'],
    responsibilities: ['Technology strategy', 'Team leadership', 'Innovation'],
    salary: 200000,
    openPositions: 0
  },
  {
    id: 'job-3',
    title: 'Engineering Manager',
    department: 'Engineering',
    level: 'Manager',
    parentJobId: 'job-2',
    requirements: ['Engineering degree', '8+ years experience', 'Team management'],
    responsibilities: ['Team management', 'Project delivery', 'Technical guidance'],
    salary: 140000,
    openPositions: 1
  },
  {
    id: 'job-4',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    level: 'Senior',
    parentJobId: 'job-3',
    requirements: ['CS degree', '5+ years experience', 'Full-stack skills'],
    responsibilities: ['Code development', 'Architecture design', 'Mentoring'],
    salary: 120000,
    openPositions: 2
  },
  {
    id: 'job-5',
    title: 'Software Engineer',
    department: 'Engineering',
    level: 'Mid-Level',
    parentJobId: 'job-4',
    requirements: ['CS degree', '2+ years experience', 'Programming skills'],
    responsibilities: ['Feature development', 'Bug fixes', 'Code reviews'],
    salary: 90000,
    openPositions: 3
  },
  {
    id: 'job-6',
    title: 'Chief Marketing Officer',
    department: 'Marketing',
    level: 'C-Level',
    parentJobId: 'job-1',
    requirements: ['Marketing degree', '10+ years experience', 'Brand strategy'],
    responsibilities: ['Marketing strategy', 'Brand management', 'Campaign oversight'],
    salary: 180000,
    openPositions: 0
  },
  {
    id: 'job-7',
    title: 'Marketing Manager',
    department: 'Marketing',
    level: 'Manager',
    parentJobId: 'job-6',
    requirements: ['Marketing degree', '5+ years experience', 'Campaign management'],
    responsibilities: ['Campaign execution', 'Team coordination', 'Analytics'],
    salary: 85000,
    openPositions: 1
  },
  {
    id: 'job-8',
    title: 'Marketing Specialist',
    department: 'Marketing',
    level: 'Entry-Level',
    parentJobId: 'job-7',
    requirements: ['Marketing degree', '1+ years experience', 'Digital marketing'],
    responsibilities: ['Content creation', 'Social media', 'Market research'],
    salary: 55000,
    openPositions: 2
  }
];

const initialForms: FormNode[] = [
  {
    id: 'form-cat-1',
    title: 'HR Forms',
    category: 'Category',
    fields: 0,
    submissions: 0,
    createdAt: '2024-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'form-1',
    title: 'Employee Onboarding',
    category: 'HR',
    parentFormId: 'form-cat-1',
    fields: 12,
    submissions: 45,
    createdAt: '2024-01-15T10:00:00Z',
    status: 'active'
  },
  {
    id: 'form-2',
    title: 'Performance Review',
    category: 'HR',
    parentFormId: 'form-cat-1',
    fields: 8,
    submissions: 32,
    createdAt: '2024-01-20T14:30:00Z',
    status: 'active'
  },
  {
    id: 'form-cat-2',
    title: 'Customer Forms',
    category: 'Category',
    fields: 0,
    submissions: 0,
    createdAt: '2024-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'form-3',
    title: 'Customer Feedback',
    category: 'Customer',
    parentFormId: 'form-cat-2',
    fields: 6,
    submissions: 128,
    createdAt: '2024-01-10T09:00:00Z',
    status: 'active'
  },
  {
    id: 'form-4',
    title: 'Support Ticket',
    category: 'Customer',
    parentFormId: 'form-cat-2',
    fields: 5,
    submissions: 89,
    createdAt: '2024-01-25T16:45:00Z',
    status: 'active'
  },
  {
    id: 'form-cat-3',
    title: 'Project Forms',
    category: 'Category',
    fields: 0,
    submissions: 0,
    createdAt: '2024-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'form-5',
    title: 'Project Proposal',
    category: 'Project',
    parentFormId: 'form-cat-3',
    fields: 10,
    submissions: 23,
    createdAt: '2024-02-01T11:20:00Z',
    status: 'active'
  },
  {
    id: 'form-6',
    title: 'Task Assignment',
    category: 'Project',
    parentFormId: 'form-cat-3',
    fields: 7,
    submissions: 67,
    createdAt: '2024-02-05T13:15:00Z',
    status: 'active'
  },
  {
    id: 'form-7',
    title: 'Project Status Report',
    category: 'Project',
    parentFormId: 'form-cat-3',
    fields: 9,
    submissions: 41,
    createdAt: '2024-02-10T10:30:00Z',
    status: 'draft'
  }
];

const initialState: VisualizeState = {
  teams: initialTeams,
  jobs: initialJobs,
  forms: initialForms,
  activeView: 'teams',
  loading: false,
  error: null
};

const visualizeSlice = createSlice({
  name: 'visualize',
  initialState,
  reducers: {
    setActiveView: (state, action: PayloadAction<'teams' | 'jobs' | 'forms'>) => {
      state.activeView = action.payload;
    },
    addTeamMember: (state, action: PayloadAction<Omit<TeamNode, 'id'>>) => {
      const newMember: TeamNode = {
        ...action.payload,
        id: `team-${Date.now()}`
      };
      state.teams.push(newMember);
    },
    addJob: (state, action: PayloadAction<Omit<JobNode, 'id'>>) => {
      const newJob: JobNode = {
        ...action.payload,
        id: `job-${Date.now()}`
      };
      state.jobs.push(newJob);
    },
    addFormNode: (state, action: PayloadAction<Omit<FormNode, 'id'>>) => {
      const newForm: FormNode = {
        ...action.payload,
        id: `form-${Date.now()}`
      };
      state.forms.push(newForm);
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
  setActiveView,
  addTeamMember,
  addJob,
  addFormNode,
  setLoading,
  setError
} = visualizeSlice.actions;

export default visualizeSlice.reducer;
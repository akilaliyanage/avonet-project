// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  monthlyExpenseLimit: number;
  currency: string;
}

// Expense Types
export enum ExpenseType {
  FOOD = 'food',
  TRANSPORT = 'transport',
  ENTERTAINMENT = 'entertainment',
  SHOPPING = 'shopping',
  BILLS = 'bills',
  HEALTH = 'health',
  EDUCATION = 'education',
  OTHER = 'other',
}

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  date: string;
  type: ExpenseType;
  userId: string;
  currency: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExpenseData {
  description: string;
  amount: number;
  date: Date;
  type: ExpenseType;
  notes?: string;
}

export interface UpdateExpenseData {
  description?: string;
  amount?: number;
  date?: Date;
  type?: ExpenseType;
  notes?: string;
}

// Filter Types
export interface ExpenseFilters {
  type?: ExpenseType;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Stats Types
export interface ExpenseStats {
  totalAmount: number;
  monthlyLimit: number;
  percentageUsed: number;
  isAlert: boolean;
  alertMessage?: string;
}

export interface MonthlyStats {
  totalAmount: number;
  count: number;
  expensesByType: Record<ExpenseType, number>;
  startDate: string;
  endDate: string;
}

export interface ExpensePattern {
  month: string;
  total: number;
  byType: Record<ExpenseType, number>;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface FormField {
  value: string | number | Date;
  error?: string;
  touched: boolean;
}

export interface ExpenseFormData {
  description: FormField;
  amount: FormField;
  date: FormField;
  type: FormField;
  notes: FormField;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Component Props
export interface ExpenseListProps {
  expenses: Expense[];
  onExpenseUpdate: () => void;
  onEditExpense: (expense: Expense) => void;
  loadingState: LoadingState;
}

export interface ExpenseFormProps {
  onSubmit: (data: CreateExpenseData | UpdateExpenseData) => void;
  onCancel: () => void;
  initialData?: Expense;
  loadingState: LoadingState;
}

export interface ExpenseStatsProps {
  stats: ExpenseStats | null;
  loadingState: LoadingState;
} 
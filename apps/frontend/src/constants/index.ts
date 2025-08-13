import { ExpenseType } from '../types';

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  ENDPOINTS: {
    EXPENSES: '/expenses',
    AUTH: {
      PROFILE: '/auth/profile',
      TEST: '/auth/test',
      HEALTH: '/auth/health',
    },
  },
  HEADERS: {
    CONTENT_TYPE: 'application/json',
  },
} as const;

// Expense Type Configuration
export const EXPENSE_TYPES = [
  { value: ExpenseType.FOOD, label: 'Food', color: 'primary' },
  { value: ExpenseType.TRANSPORT, label: 'Transport', color: 'secondary' },
  { value: ExpenseType.ENTERTAINMENT, label: 'Entertainment', color: 'success' },
  { value: ExpenseType.SHOPPING, label: 'Shopping', color: 'warning' },
  { value: ExpenseType.BILLS, label: 'Bills', color: 'error' },
  { value: ExpenseType.HEALTH, label: 'Health', color: 'info' },
  { value: ExpenseType.EDUCATION, label: 'Education', color: 'default' },
  { value: ExpenseType.OTHER, label: 'Other', color: 'default' },
] as const;

// Form Validation Rules
export const VALIDATION_RULES = {
  DESCRIPTION: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
  AMOUNT: {
    MIN: 0,
    MAX: 1000000,
  },
  NOTES: {
    MAX_LENGTH: 500,
  },
} as const;

// UI Configuration
export const UI_CONFIG = {
  CURRENCY: 'LKR',
  DATE_FORMAT: 'MMM DD, YYYY',
  DECIMAL_PLACES: 2,
  CHART_COLORS: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC0CB', '#DDA0DD'],
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  EXPENSE_CREATED: 'Expense created successfully!',
  EXPENSE_UPDATED: 'Expense updated successfully!',
  EXPENSE_DELETED: 'Expense deleted successfully!',
} as const;

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  EXPENSE_FILTERS: 'expense_filters',
  THEME: 'theme',
} as const; 
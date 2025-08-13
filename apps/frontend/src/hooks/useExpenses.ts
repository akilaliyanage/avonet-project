import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../services/api';
import { 
  Expense, 
  CreateExpenseData, 
  UpdateExpenseData, 
  ExpenseFilters, 
  ExpenseStats, 
  ExpensePattern,
  LoadingState 
} from '../types';
import { SUCCESS_MESSAGES } from '../constants';

export const useExpenses = () => {
  const api = useApi();
  
  // State management
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [patterns, setPatterns] = useState<ExpensePattern[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>({});
  
  // Loading states
  const [expensesLoading, setExpensesLoading] = useState<LoadingState>({ isLoading: false, error: null });
  const [statsLoading, setStatsLoading] = useState<LoadingState>({ isLoading: false, error: null });
  const [patternsLoading, setPatternsLoading] = useState<LoadingState>({ isLoading: false, error: null });
  const [operationLoading, setOperationLoading] = useState<LoadingState>({ isLoading: false, error: null });

  // Fetch expenses with filters
  const fetchExpenses = useCallback(async (newFilters?: ExpenseFilters) => {
    const currentFilters = newFilters || filters;
    const result = await api.getExpenses(currentFilters, {
      onLoading: (loading) => setExpensesLoading(prev => ({ ...prev, isLoading: loading })),
      onError: (error) => setExpensesLoading(prev => ({ ...prev, error }))
    });
    
    if (result) {
      setExpenses(result);
    }
  }, [api, filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    const currentDate = new Date();
    const result = await api.getExpenseStats(
      currentDate.getFullYear(), 
      currentDate.getMonth() + 1,
      {
        onLoading: (loading) => setStatsLoading(prev => ({ ...prev, isLoading: loading })),
        onError: (error) => setStatsLoading(prev => ({ ...prev, error }))
      }
    );
    
    if (result) {
      setStats(result);
    }
  }, [api]);

  // Fetch patterns
  const fetchPatterns = useCallback(async (months: number = 6) => {
    const result = await api.getExpensePatterns(months, {
      onLoading: (loading) => setPatternsLoading(prev => ({ ...prev, isLoading: loading })),
      onError: (error) => setPatternsLoading(prev => ({ ...prev, error }))
    });
    
    if (result) {
      setPatterns(result);
    }
  }, [api]);

  // Create expense
  const createExpense = useCallback(async (data: CreateExpenseData) => {
    const result = await api.createExpense(data, {
      onLoading: (loading) => setOperationLoading(prev => ({ ...prev, isLoading: loading })),
      onError: (error) => setOperationLoading(prev => ({ ...prev, error }))
    });
    
    if (result) {
      // Refresh data after successful creation
      await Promise.all([
        fetchExpenses(),
        fetchStats(),
        fetchPatterns()
      ]);
      return { success: true, message: SUCCESS_MESSAGES.EXPENSE_CREATED };
    }
    
    return { success: false, message: operationLoading.error };
  }, [api, fetchExpenses, fetchStats, fetchPatterns, operationLoading.error]);

  // Update expense
  const updateExpense = useCallback(async (id: string, data: UpdateExpenseData) => {
    const result = await api.updateExpense(id, data, {
      onLoading: (loading) => setOperationLoading(prev => ({ ...prev, isLoading: loading })),
      onError: (error) => setOperationLoading(prev => ({ ...prev, error }))
    });
    
    if (result) {
      // Refresh data after successful update
      await Promise.all([
        fetchExpenses(),
        fetchStats(),
        fetchPatterns()
      ]);
      return { success: true, message: SUCCESS_MESSAGES.EXPENSE_UPDATED };
    }
    
    return { success: false, message: operationLoading.error };
  }, [api, fetchExpenses, fetchStats, fetchPatterns, operationLoading.error]);

  // Delete expense
  const deleteExpense = useCallback(async (id: string) => {
    const result = await api.deleteExpense(id, {
      onLoading: (loading) => setOperationLoading(prev => ({ ...prev, isLoading: loading })),
      onError: (error) => setOperationLoading(prev => ({ ...prev, error }))
    });
    
    if (result) {
      // Refresh data after successful deletion
      await Promise.all([
        fetchExpenses(),
        fetchStats(),
        fetchPatterns()
      ]);
      return { success: true, message: SUCCESS_MESSAGES.EXPENSE_DELETED };
    }
    
    return { success: false, message: operationLoading.error };
  }, [api, fetchExpenses, fetchStats, fetchPatterns, operationLoading.error]);

  // Update filters
  const updateFilters = useCallback((newFilters: ExpenseFilters) => {
    setFilters(newFilters);
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchExpenses(),
      fetchStats(),
      fetchPatterns()
    ]);
  }, [fetchExpenses, fetchStats, fetchPatterns]);

  // Initial data fetch
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    // Data
    expenses,
    stats,
    patterns,
    filters,
    
    // Loading states
    expensesLoading,
    statsLoading,
    patternsLoading,
    operationLoading,
    
    // Actions
    fetchExpenses,
    fetchStats,
    fetchPatterns,
    createExpense,
    updateExpense,
    deleteExpense,
    updateFilters,
    clearFilters,
    refreshData,
  };
}; 
import { useAuth0 } from '@auth0/auth0-react';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';
import { 
  Expense, 
  CreateExpenseData, 
  UpdateExpenseData, 
  ExpenseFilters, 
  ExpenseStats, 
  ExpensePattern,
  ApiResponse 
} from '../types';

// Base API client with authentication
class ApiClient {
  private getAuthHeaders = async (): Promise<HeadersInit> => {
    const { getAccessTokenSilently } = useAuth0();
    try {
      const token = await getAccessTokenSilently();
      return {
        'Content-Type': API_CONFIG.HEADERS.CONTENT_TYPE,
        Authorization: `Bearer ${token}`,
      };
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
    }
  };

  private handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      let errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If we can't parse the error response, use status-based messages
        switch (response.status) {
          case 401:
            errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
            break;
          case 404:
            errorMessage = ERROR_MESSAGES.NOT_FOUND;
            break;
          case 422:
            errorMessage = ERROR_MESSAGES.VALIDATION_ERROR;
            break;
          case 500:
            errorMessage = ERROR_MESSAGES.SERVER_ERROR;
            break;
        }
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  };

  // Generic request method
  private request = async <T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> => {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });
      
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
  };

  // Expense API methods
  getExpenses = async (filters?: ExpenseFilters): Promise<Expense[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `${API_CONFIG.ENDPOINTS.EXPENSES}?${queryString}` : API_CONFIG.ENDPOINTS.EXPENSES;
    
    return this.request<Expense[]>(endpoint);
  };

  getExpense = async (id: string): Promise<Expense> => {
    return this.request<Expense>(`${API_CONFIG.ENDPOINTS.EXPENSES}/${id}`);
  };

  createExpense = async (data: CreateExpenseData): Promise<Expense> => {
    return this.request<Expense>(API_CONFIG.ENDPOINTS.EXPENSES, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  updateExpense = async (id: string, data: UpdateExpenseData): Promise<Expense> => {
    return this.request<Expense>(`${API_CONFIG.ENDPOINTS.EXPENSES}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  };

  deleteExpense = async (id: string): Promise<{ message: string }> => {
    return this.request<{ message: string }>(`${API_CONFIG.ENDPOINTS.EXPENSES}/${id}`, {
      method: 'DELETE',
    });
  };

  // Stats API methods
  getExpenseStats = async (year: number, month: number): Promise<ExpenseStats> => {
    return this.request<ExpenseStats>(
      `${API_CONFIG.ENDPOINTS.EXPENSES}/stats/alert?year=${year}&month=${month}`
    );
  };

  getExpensePatterns = async (months: number = 6): Promise<ExpensePattern[]> => {
    return this.request<ExpensePattern[]>(
      `${API_CONFIG.ENDPOINTS.EXPENSES}/stats/patterns?months=${months}`
    );
  };

  // Auth API methods
  getProfile = async (): Promise<any> => {
    return this.request<any>(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
  };

  testAuth = async (): Promise<any> => {
    return this.request<any>(API_CONFIG.ENDPOINTS.AUTH.TEST);
  };

  healthCheck = async (): Promise<any> => {
    return this.request<any>(API_CONFIG.ENDPOINTS.AUTH.HEALTH);
  };
}

// Custom hook for API operations
export const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();
  
  const apiClient = new ApiClient();
  
  // Wrap API calls with loading and error states
  const withLoadingState = async <T>(
    apiCall: () => Promise<T>,
    onLoading?: (loading: boolean) => void,
    onError?: (error: string | null) => void
  ): Promise<T | null> => {
    try {
      onLoading?.(true);
      onError?.(null);
      const result = await apiCall();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      onError?.(errorMessage);
      return null;
    } finally {
      onLoading?.(false);
    }
  };

  return {
    // Expense operations
    getExpenses: (filters?: ExpenseFilters, callbacks?: { onLoading?: (loading: boolean) => void; onError?: (error: string | null) => void }) =>
      withLoadingState(() => apiClient.getExpenses(filters), callbacks?.onLoading, callbacks?.onError),
    
    getExpense: (id: string, callbacks?: { onLoading?: (loading: boolean) => void; onError?: (error: string | null) => void }) =>
      withLoadingState(() => apiClient.getExpense(id), callbacks?.onLoading, callbacks?.onError),
    
    createExpense: (data: CreateExpenseData, callbacks?: { onLoading?: (loading: boolean) => void; onError?: (error: string | null) => void }) =>
      withLoadingState(() => apiClient.createExpense(data), callbacks?.onLoading, callbacks?.onError),
    
    updateExpense: (id: string, data: UpdateExpenseData, callbacks?: { onLoading?: (loading: boolean) => void; onError?: (error: string | null) => void }) =>
      withLoadingState(() => apiClient.updateExpense(id, data), callbacks?.onLoading, callbacks?.onError),
    
    deleteExpense: (id: string, callbacks?: { onLoading?: (loading: boolean) => void; onError?: (error: string | null) => void }) =>
      withLoadingState(() => apiClient.deleteExpense(id), callbacks?.onLoading, callbacks?.onError),
    
    // Stats operations
    getExpenseStats: (year: number, month: number, callbacks?: { onLoading?: (loading: boolean) => void; onError?: (error: string | null) => void }) =>
      withLoadingState(() => apiClient.getExpenseStats(year, month), callbacks?.onLoading, callbacks?.onError),
    
    getExpensePatterns: (months?: number, callbacks?: { onLoading?: (loading: boolean) => void; onError?: (error: string | null) => void }) =>
      withLoadingState(() => apiClient.getExpensePatterns(months), callbacks?.onLoading, callbacks?.onError),
    
    // Auth operations
    getProfile: (callbacks?: { onLoading?: (loading: boolean) => void; onError?: (error: string | null) => void }) =>
      withLoadingState(() => apiClient.getProfile(), callbacks?.onLoading, callbacks?.onError),
    
    testAuth: (callbacks?: { onLoading?: (loading: boolean) => void; onError?: (error: string | null) => void }) =>
      withLoadingState(() => apiClient.testAuth(), callbacks?.onLoading, callbacks?.onError),
    
    healthCheck: (callbacks?: { onLoading?: (loading: boolean) => void; onError?: (error: string | null) => void }) =>
      withLoadingState(() => apiClient.healthCheck(), callbacks?.onLoading, callbacks?.onError),
  };
}; 
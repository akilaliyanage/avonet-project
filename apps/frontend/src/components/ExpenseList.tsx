import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Box,
  TextField,
  MenuItem,
} from '@mui/material';
import { Edit, Delete, FilterList } from '@mui/icons-material';
import dayjs from 'dayjs';

const expenseTypeLabels = {
  food: 'Food',
  transport: 'Transport',
  entertainment: 'Entertainment',
  shopping: 'Shopping',
  bills: 'Bills',
  health: 'Health',
  education: 'Education',
  other: 'Other',
};

const expenseTypeColors = {
  food: 'primary',
  transport: 'secondary',
  entertainment: 'success',
  shopping: 'warning',
  bills: 'error',
  health: 'info',
  education: 'default',
  other: 'default',
};

interface ExpenseListProps {
  expenses: any[];
  onExpenseUpdate: () => void;
  onEditExpense: (expense: any) => void;
}

export default function ExpenseList({ expenses, onExpenseUpdate, onEditExpense }: ExpenseListProps) {
  const { getAccessTokenSilently } = useAuth0();
  const [filters, setFilters] = useState({
    type: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/expenses/${id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          onExpenseUpdate();
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    if (filters.type && expense.type !== filters.type) return false;
    if (filters.minAmount && expense.amount < parseFloat(filters.minAmount)) return false;
    if (filters.maxAmount && expense.amount > parseFloat(filters.maxAmount)) return false;
    if (filters.startDate && new Date(expense.date) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(expense.date) > new Date(filters.endDate)) return false;
    return true;
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <FilterList />
        <Typography variant="h6">
          Expenses
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
          <TextField
            select
            fullWidth
            label="Type"
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            size="small"
          >
            <MenuItem value="">All Types</MenuItem>
            {Object.entries(expenseTypeLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
          <TextField
            type="date"
            fullWidth
            label="Start Date"
            value={filters.startDate}
            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
          <TextField
            type="date"
            fullWidth
            label="End Date"
            value={filters.endDate}
            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
          <TextField
            type="number"
            fullWidth
            label="Min Amount"
            value={filters.minAmount}
            onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
            size="small"
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
          <TextField
            type="number"
            fullWidth
            label="Max Amount"
            value={filters.maxAmount}
            onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
            size="small"
          />
        </Box>
      </Box>

      {/* Expenses Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No expenses found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      LKR {expense.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={expenseTypeLabels[expense.type as keyof typeof expenseTypeLabels] || 'Other'}
                      color={(expenseTypeColors[expense.type as keyof typeof expenseTypeColors] as any) || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {dayjs(expense.date).format('MMM DD, YYYY')}
                  </TableCell>
                  <TableCell>
                    {expense.notes || '-'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEditExpense(expense)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(expense._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
} 
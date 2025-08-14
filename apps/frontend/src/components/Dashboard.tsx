import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  Container,
  Paper,
  Button,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Alert,
} from '@mui/material';
import { Add, AccountCircle, Logout } from '@mui/icons-material';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import ExpenseStats from './ExpenseStats';
import ExpenseCharts from './ExpenseCharts';
import { Expense, CreateExpenseData, UpdateExpenseData, ExpenseStats as StatsType } from '../types';

export default function Dashboard() {
  const { logout, user, getAccessTokenSilently } = useAuth0();
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<StatsType | null>(null);
  const [alert, setAlert] = useState<string | null>(null);

  // Fetch expenses and stats when component mounts
  useEffect(() => {
    fetchExpenses();
    fetchStats();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = await getAccessTokenSilently();
      const currentDate = new Date();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/expenses/stats/alert?year=${currentDate.getFullYear()}&month=${currentDate.getMonth() + 1}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        if (data.isAlert) {
          setAlert(data.alertMessage);
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddExpense = async (expenseData: CreateExpenseData) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
      });
      
      if (response.ok) {
        setShowExpenseForm(false);
        setEditingExpense(null);
        fetchExpenses();
        fetchStats();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleEditExpense = async (expenseData: UpdateExpenseData) => {
    if (!editingExpense) return;
    
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses/${editingExpense._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
      });
      
      if (response.ok) {
        setShowExpenseForm(false);
        setEditingExpense(null);
        fetchExpenses();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleStartEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleCancelEdit = () => {
    setShowExpenseForm(false);
    setEditingExpense(null);
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Avonet Expense Tracker
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2">
              Welcome, {user?.name}
            </Typography>
            <IconButton color="inherit">
              <AccountCircle />
            </IconButton>
            <IconButton color="inherit" onClick={handleLogout}>
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        {alert && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {alert}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Stats and Add Button Row */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
              <ExpenseStats stats={stats} />
            </Box>
            <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowExpenseForm(true)}
                  size="large"
                >
                  Add New Expense
                </Button>
              </Paper>
            </Box>
          </Box>

          {/* Expense Form */}
          {showExpenseForm && (
            <Box>
              <ExpenseForm
                onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
                onCancel={handleCancelEdit}
                initialData={editingExpense}
              />
            </Box>
          )}

          {/* Charts */}
          <Box>
            <ExpenseCharts />
          </Box>

          {/* Expense List */}
          <Box>
            <ExpenseList 
              expenses={expenses} 
              onExpenseUpdate={fetchExpenses}
              onEditExpense={handleStartEdit}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 
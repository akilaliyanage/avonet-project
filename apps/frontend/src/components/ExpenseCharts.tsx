import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC0CB', '#DDA0DD'];

interface ExpensePattern {
  month: string;
  total: number;
  byType: Record<string, number>;
}

export default function ExpenseCharts() {
  const { getAccessTokenSilently } = useAuth0();
  const [expensePatterns, setExpensePatterns] = useState<ExpensePattern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpensePatterns();
  }, []);

  const fetchExpensePatterns = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/expenses/stats/patterns?months=6`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setExpensePatterns(data);
      }
    } catch (error) {
      console.error('Error fetching expense patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading charts...
        </Typography>
      </Paper>
    );
  }

  // Prepare data for pie chart (expense types)
  const pieChartData = Object.entries(
    expensePatterns.reduce((acc: Record<string, number>, month) => {
      Object.entries(month.byType).forEach(([type, amount]) => {
        acc[type] = (acc[type] || 0) + amount;
      });
      return acc;
    }, {})
  ).map(([type, amount]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: amount,
  }));

  // Prepare data for bar chart (monthly totals)
  const barChartData = expensePatterns.map(month => ({
    month: month.month,
    total: month.total,
  }));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Expense Analytics
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Pie Chart - Expense Types */}
        <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
          <Typography variant="subtitle1" gutterBottom>
            Expense Distribution by Type
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `LKR ${(value as number).toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        
        {/* Bar Chart - Monthly Trends */}
        <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
          <Typography variant="subtitle1" gutterBottom>
            Monthly Spending Trends
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `LKR ${(value as number).toFixed(2)}`} />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Paper>
  );
} 
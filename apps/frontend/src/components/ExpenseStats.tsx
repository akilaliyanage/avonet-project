import {
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  LinearProgress,
} from '@mui/material';
import { TrendingUp, AccountBalanceWallet, Warning } from '@mui/icons-material';

interface ExpenseStatsProps {
  stats: any;
}

export default function ExpenseStats({ stats }: ExpenseStatsProps) {
  if (!stats) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Monthly Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Loading stats...
        </Typography>
      </Paper>
    );
  }

  const { totalAmount, monthlyLimit, percentageUsed, isAlert } = stats;
  const progressValue = Math.min(percentageUsed, 100);

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Monthly Overview
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <AccountBalanceWallet color="primary" />
            <Typography variant="h4" component="span">
              LKR {totalAmount?.toFixed(2) || '0.00'}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Total Spent This Month
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">
                Budget Usage
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {percentageUsed?.toFixed(1) || 0}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              color={isAlert ? 'error' : 'primary'}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" gap={1}>
            <TrendingUp color="secondary" />
            <Typography variant="body1">
              LKR {monthlyLimit?.toFixed(2) || '0.00'}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Monthly Budget Limit
          </Typography>
        </Grid>
        
        {isAlert && (
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1}>
              <Warning color="error" />
              <Chip
                label="Budget Alert!"
                color="error"
                variant="outlined"
                size="small"
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
} 
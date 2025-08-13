import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, Typography, Paper, Container } from '@mui/material';
import { AccountBalanceWallet } from '@mui/icons-material';

export default function Login() {
  const { loginWithRedirect } = useAuth0();

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={4}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            width: '100%',
          }}
        >
          <AccountBalanceWallet sx={{ fontSize: 64, color: 'primary.main' }} />
          
          <Typography variant="h3" component="h1" textAlign="center">
            Avonet Expense Tracker
          </Typography>
          
          <Typography variant="body1" textAlign="center" color="text.secondary">
            Track your personal expenses, set budgets, and analyze spending patterns
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            onClick={() => loginWithRedirect()}
            sx={{ px: 4, py: 1.5 }}
          >
            Get Started
          </Button>
        </Paper>
      </Box>
    </Container>
  );
} 
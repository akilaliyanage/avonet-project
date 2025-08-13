'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <Login />
      )}
    </Container>
  );
}

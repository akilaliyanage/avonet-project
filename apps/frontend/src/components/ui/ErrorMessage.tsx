import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface ErrorMessageProps {
  error: string;
  title?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export default function ErrorMessage({ 
  error, 
  title = 'Error', 
  onRetry, 
  showRetry = true 
}: ErrorMessageProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <Alert 
        severity="error" 
        action={
          showRetry && onRetry ? (
            <Button 
              color="inherit" 
              size="small" 
              onClick={onRetry}
              startIcon={<Refresh />}
            >
              Retry
            </Button>
          ) : undefined
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {error}
      </Alert>
    </Box>
  );
} 
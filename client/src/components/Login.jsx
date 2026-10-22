import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, TextField, Typography, Link, Alert } from '@mui/material';
import { loginUser } from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser({ username, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: 'background.default',
        padding: 2 
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', p: 2, backgroundColor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Completionist Hub
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Sign in to track your game backlog
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mb: 2, backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'secondary.main' } }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            
            <Box textAlign="center">
              <Link component={RouterLink} to="/register" variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Link, Alert } from '@mui/material';
import api from '../services/api';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      if (response.data.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Box className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <Typography variant="h4" component="h1" className="text-center mb-6 font-bold text-gray-800">
          Create Account
        </Typography>

        {error && <Alert severity="error" className="mb-4">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="outlined"
            size="small"
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            variant="outlined"
            size="small"
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            variant="outlined"
            size="small"
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            variant="outlined"
            size="small"
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            variant="outlined"
            size="small"
          />

          <Button
            fullWidth
            variant="contained"
            color="success"
            size="large"
            type="submit"
            disabled={loading}
            className="mt-6"
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <Typography variant="body2" className="text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-green-600 font-semibold hover:underline">
            Login here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default Register;

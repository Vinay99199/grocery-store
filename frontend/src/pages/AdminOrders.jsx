import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Grid, Chip, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, TextField, Alert, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') {
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      setError('Please select a status');
      return;
    }

    try {
      await api.put(`/orders/${selectedOrder._id}/status`, { status: newStatus });
      fetchOrders();
      handleCloseDialog();
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update order');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      preparing: 'info',
      out_for_delivery: 'info',
      delivered: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      field: 'createdAt',
      headerName: 'Order Date',
      width: 150,
      valueGetter: (params) => new Date(params.row.createdAt).toLocaleDateString('en-IN')
    },
    {
      field: 'user',
      headerName: 'Customer',
      width: 130,
      valueGetter: (params) => params.row.user?.name || 'Unknown'
    },
    { field: 'totalPrice', headerName: 'Total (₹)', width: 100 },
    { field: 'paymentMethod', headerName: 'Payment', width: 100 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value.toUpperCase().replace(/_/g, ' ')}
          color={getStatusColor(params.value)}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={() => handleOpenDialog(params.row)}
        >
          Update
        </Button>
      )
    }
  ];

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" className="mb-6 font-bold text-gray-800">
        Orders Management
      </Typography>

      {error && <Alert severity="error" className="mb-4">{error}</Alert>}

      <Card>
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={orders}
              columns={columns}
              getRowId={(row) => row._id}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              pagination
              loading={loading}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Update Status Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          {selectedOrder && (
            <>
              <Box>
                <Typography variant="body2" color="textSecondary">Order ID</Typography>
                <Typography variant="body1" className="font-mono">
                  {selectedOrder._id.substring(0, 8)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Current Status</Typography>
                <Chip
                  label={selectedOrder.status.toUpperCase().replace(/_/g, ' ')}
                  color={getStatusColor(selectedOrder.status)}
                  size="small"
                />
              </Box>
              <TextField
                fullWidth
                select
                label="New Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                variant="outlined"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="preparing">Preparing</MenuItem>
                <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdateStatus} variant="contained" color="success">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AdminOrders;

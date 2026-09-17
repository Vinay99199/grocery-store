import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Chip, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    fetchNotifications();
  }, [isAuthenticated]);

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      setError('Failed to update notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      fetchNotifications();
    } catch (error) {
      setError('Failed to mark all as read');
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" className="py-8">
        <Alert severity="info">Please login to view notifications.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" component="h1" className="font-bold text-gray-800">
          Notifications
        </Typography>
        {notifications.some(n => !n.isRead) && (
          <Button variant="outlined" color="primary" onClick={handleMarkAllRead}>
            Mark All Read
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" className="mb-4">{error}</Alert>}

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Typography variant="h6" color="textSecondary">
              No notifications yet
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification._id} className={notification.isRead ? '' : 'border-l-4 border-blue-500'}>
              <CardContent>
                <Box className="flex justify-between items-start gap-3">
                  <Box>
                    <Box className="flex items-center gap-2 mb-2">
                      <Typography variant="h6" className="font-semibold">
                        {notification.title}
                      </Typography>
                      {!notification.isRead && (
                        <Chip label="New" color="primary" size="small" />
                      )}
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" className="mt-2 block">
                      {new Date(notification.createdAt).toLocaleString('en-IN')}
                    </Typography>
                  </Box>

                  {!notification.isRead && (
                    <Button size="small" variant="outlined" onClick={() => handleMarkRead(notification._id)}>
                      Mark Read
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default NotificationsPage;

import React, { useEffect, useState, useContext } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../api/api';
import { AuthContext } from '../contexts/AuthContext';

const NotificationScreen = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notification');
      setNotifications(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await api.post(`/notification/${id}/read`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {
      Alert.alert('Error', 'Failed to mark notification as read');
    }
  };

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.notificationItem, item.read && styles.read]}
          onPress={() => markAsRead(item._id)}
        >
          <Text style={styles.content}>{item.content}</Text>
          <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No notifications</Text>}
    />
  );
};

const styles = StyleSheet.create({
  notificationItem: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 6,
    marginBottom: 12,
    elevation: 1,
  },
  read: {
    opacity: 0.6,
  },
  content: {
    fontSize: 16,
  },
  time: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
});

export default NotificationScreen;

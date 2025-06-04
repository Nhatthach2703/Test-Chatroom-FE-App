import React, { useContext, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatRoomListScreen from '../screens/ChatRoomListScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import { AuthContext } from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import { SocketContext } from '../contexts/SocketContext';
import api from '../api/api';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { user } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useContext(SocketContext);

  // Lấy số notification chưa đọc
  const fetchUnreadCount = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notification');
      setUnreadCount(res.data.length);
    } catch {}
  };

  useEffect(() => {
    fetchUnreadCount();
  }, [user]);

  // Lắng nghe notification realtime từ socket nếu cần (thường backend emit)
  useEffect(() => {
    if (!socket) return;
    const handleNewNotification = () => fetchUnreadCount();
    socket.on('newNotification', handleNewNotification);
    return () => {
      socket.off('newNotification', handleNewNotification);
    };
  }, [socket]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarBadge:
          route.name === 'Notifications' && unreadCount > 0 ? unreadCount : undefined,
      })}
    >
      <Tab.Screen name="Chat Rooms" component={ChatRoomListScreen} />
      <Tab.Screen name="Notifications" component={NotificationScreen} />
    </Tab.Navigator>
  );
}

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  console.log('AppNavigator user:', user);
  if (loading) return null; // Hiện loading khi check token

  // KHÔNG bọc NavigationContainer ở đây nữa
  return user ? (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
    </Stack.Navigator>
  ) : (
    <AuthNavigator />
  );
};

export default AppNavigator;

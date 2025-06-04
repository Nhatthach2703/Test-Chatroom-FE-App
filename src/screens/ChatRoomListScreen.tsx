import React, { useContext, useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, RefreshControl } from 'react-native';
import api from '../api/api';
import { AuthContext } from '../contexts/AuthContext';
import ChatRoomItem from '../components/ChatRoomItem';
import { SocketContext } from '../contexts/SocketContext';

const ChatRoomListScreen = ({ navigation }: any) => {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChatRooms = async () => {
    if (!user) return;
    try {
      const res = await api.get('/chatroom'); // Đúng endpoint backend
      setChatRooms(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchChatRooms();
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: any) => {
      // Update chatroom list unread count (simple logic)
      setChatRooms((prev) =>
        prev.map((room) =>
          room._id === message.chatRoomId
            ? { ...room, unreadCount: (room.unreadCount || 0) + 1 }
            : room
        )
      );
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChatRooms();
    setRefreshing(false);
  };

  return (
    <FlatList
      data={chatRooms}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <ChatRoomItem
          chatRoom={item}
          onPress={() => navigation.navigate('ChatRoom', { chatRoomId: item._id })}
        />
      )}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ paddingBottom: 80 }}
    />
  );
};

export default ChatRoomListScreen;

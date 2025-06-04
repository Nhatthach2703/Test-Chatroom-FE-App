import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, TextInput, Button, FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import api from '../api/api';
import { AuthContext } from '../contexts/AuthContext';
import { SocketContext } from '../contexts/SocketContext';
import MessageItem from '../components/MessageItem';

const ChatRoomScreen = ({ route }: any) => {
  const { chatRoomId } = route.params;
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/chatrooms/${chatRoomId}/messages`);
      setMessages(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchMessages();
  }, [chatRoomId]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: any) => {
      if (message.chatRoomId === chatRoomId) {
        setMessages((prev) => [...prev, message]);
        // Scroll to bottom mỗi khi có tin nhắn mới
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, chatRoomId]);

  const sendMessage = () => {
  if (!input.trim() || !socket || !user) return;
  const messageData = { chatRoomId, content: input, senderId: user._id };
  console.log('Sending message:', messageData);
  socket.emit('sendMessage', messageData);
  setInput('');
};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={80}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <MessageItem message={item} isOwnMessage={item.sender._id === user?._id} />
        )}
        contentContainerStyle={{ padding: 12 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          style={styles.input}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
});

export default ChatRoomScreen;

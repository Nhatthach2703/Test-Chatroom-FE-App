import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { socket } from '../utils/socket';
import { API_URL } from '../utils/api';

export default function ChatRoom({ route }: { route: any }) {
  const { room } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [sender, setSender] = useState('');

  useEffect(() => {
    socket.emit('joinRoom', room._id);
    axios.get(`${API_URL}/api/chat/rooms/${room._id}/messages`).then(res => {
      setMessages(res.data);
    });

    socket.on('newMessage', msg => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, []);

  const sendMessage = () => {
    if (!sender.trim() || !text.trim()) return;
    socket.emit('sendMessage', {
      chatRoomId: room._id,
      sender,
      content: text,
    });
    setText('');
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.messageContainer, item.sender === sender ? styles.myMessage : styles.otherMessage]}>
      <Text style={styles.sender}>{item.sender}</Text>
      <Text style={styles.content}>{item.content}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <Text style={styles.roomName}>{room.name}</Text>
      <FlatList
        data={messages}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={sender}
          onChangeText={setSender}
          placeholder="Your name"
          style={styles.input}
        />
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          style={styles.input}
        />
        <Button title="Send" onPress={sendMessage} color="#007AFF" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  roomName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    color: '#007AFF',
  },
  messagesList: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  messageContainer: {
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  myMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  sender: {
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 2,
  },
  content: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'column',
    gap: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
});

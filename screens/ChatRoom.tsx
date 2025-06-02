import React, { useEffect, useState, useRef } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { socket } from '../utils/socket';
import { API_URL } from '../utils/api';
import { AntDesign } from '@expo/vector-icons'; // Nếu bạn dùng Expo, nếu không thì dùng icon khác

export default function ChatRoom({ route }: { route: any }) {
  const { room } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [sender, setSender] = useState('');
  const [showScrollToEnd, setShowScrollToEnd] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const isAtBottom = useRef(true);
  const prevMessagesLength = useRef(0);
  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    // Khi socket kết nối lại, join lại phòng
    const handleConnect = () => {
      socket.emit('joinRoom', room._id);
    };
    socket.on('connect', handleConnect);

    // Đảm bảo join phòng ngay khi vào
    socket.emit('joinRoom', room._id);
    axios.get(`${API_URL}/api/chat/rooms/${room._id}/messages`).then(res => {
      setMessages(res.data);
    });

    socket.on('newMessage', msg => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('newMessage');
      socket.off('connect', handleConnect);
    };
  }, [room._id]);

  // Khi vào phòng chat, tự động cuộn xuống cuối 1 lần duy nhất
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages.length === 1]); // chỉ chạy khi load lần đầu

  // Theo dõi scroll để biết có ở cuối không
  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const atBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    isAtBottom.current = atBottom;
    if (atBottom) {
      setHasNewMessage(false);
    }
  };

  // Khi có tin nhắn mới, nếu không ở cuối thì hiện icon
  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      if (!isAtBottom.current) {
        setHasNewMessage(true);
      } else {
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  const sendMessage = async () => {
    if (!sender.trim() || !text.trim()) return;
    try {
      await axios.post(`${API_URL}/api/chat/messages`, {
        chatRoomId: room._id,
        sender,
        content: text,
      });
      setText('');
    } catch (error) {
      // Bạn có thể xử lý lỗi ở đây nếu muốn
      console.error('Send message error:', error);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.messageContainer, item.sender === sender ? styles.myMessage : styles.otherMessage]}>
      <Text style={styles.sender}>{item.sender}</Text>
      <Text style={styles.content}>{item.content}</Text>
    </View>
  );

  // Hàm cuộn xuống cuối khi bấm icon
  const scrollToEnd = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
      setHasNewMessage(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <Text style={styles.roomName}>{room.name}</Text>
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesList}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
        {hasNewMessage && (
          <TouchableOpacity style={styles.scrollToEndBtn} onPress={scrollToEnd}>
            <AntDesign name="downcircle" size={36} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>
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
  scrollToEndBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: 2,
  },
});

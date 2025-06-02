import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import axios from 'axios';
import { API_URL } from '../utils/api';

export default function ChatList({ navigation }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/chat/rooms`).then(res => {
      setRooms(res.data);
    });
  }, []);

  return (
    <View>
      <FlatList
        data={rooms}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <Button title={item.name} onPress={() => navigation.navigate('ChatRoom', { room: item })} />
        )}
      />
    </View>
  );
}

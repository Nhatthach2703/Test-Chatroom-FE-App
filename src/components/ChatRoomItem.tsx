import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  chatRoom: {
    _id: string;
    name?: string;
    participants: { username: string }[];
    unreadCount?: number;
  };
  onPress: () => void;
}

const ChatRoomItem = ({ chatRoom, onPress }: Props) => {
  const title = chatRoom.name || chatRoom.participants.map(p => p.username).join(', ');

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      {chatRoom.unreadCount && chatRoom.unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{chatRoom.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
  },
  badge: {
    backgroundColor: 'red',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatRoomItem;

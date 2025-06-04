import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  message: {
    _id: string;
    content: string;
    sender: { username: string };
    createdAt?: string;
  };
  isOwnMessage: boolean;
}

const MessageItem = ({ message, isOwnMessage }: Props) => {
  return (
    <View style={[styles.container, isOwnMessage ? styles.right : styles.left]}>
      <Text style={styles.sender}>{message.sender.username}</Text>
      <Text style={styles.content}>{message.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    maxWidth: '70%',
    padding: 8,
    borderRadius: 8,
  },
  left: {
    backgroundColor: '#e2e2e2',
    alignSelf: 'flex-start',
  },
  right: {
    backgroundColor: '#0b93f6',
    alignSelf: 'flex-end',
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#555',
  },
  content: {
    color: 'white',
  },
});

export default MessageItem;

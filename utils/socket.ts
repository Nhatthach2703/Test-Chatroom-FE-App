import { API_URL } from './api';
import { io } from 'socket.io-client';
export const socket = io(API_URL); // dùng IP thật khi chạy thiết bị thật

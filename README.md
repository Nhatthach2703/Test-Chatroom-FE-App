# Test Chat Room FE App

This project is a simple chat room client application built with React Native (Expo). It allows users to view a list of chat rooms and participate in real-time conversations using Socket.IO. The app is designed for educational purposes and demonstrates the integration of real-time communication in a mobile environment.

## Features
- **View Chat Rooms:** Browse a list of available chat rooms fetched from the backend server.
- **Join & Chat in Real Time:** Enter any room to send and receive messages instantly with other users via Socket.IO.
- **Responsive UI:** Clean and user-friendly interface optimized for both Android and iOS.
- **Automatic Room Join:** Automatically joins the selected chat room and listens for new messages.
- **Persistent Message History:** Loads previous messages for each room when you enter.

## Technologies Used
- **React Native (Expo):** For cross-platform mobile development.
- **TypeScript:** Ensures type safety and better code maintainability.
- **React Navigation:** Handles screen navigation and stack management.
- **Socket.IO Client:** Enables real-time, bidirectional communication with the backend.
- **Axios:** For making HTTP requests to the backend API.

## Project Structure
```
├── App.tsx                # Entry point, sets up navigation
├── screens/
│   ├── ChatList.tsx       # Screen to display all chat rooms
│   └── ChatRoom.tsx       # Screen for chatting within a room
├── utils/
│   ├── api.ts             # API base URL configuration
│   └── socket.ts          # Socket.IO client setup
├── assets/                # Static assets (images, icons, etc.)
├── package.json           # Project metadata and dependencies
└── ...
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation
1. **Install Expo CLI globally (if not already installed):**
   ```sh
   npm install -g expo-cli
   ```
2. **Install project dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm start
   ```
   Or run directly on your device/emulator:
   ```sh
   npm run android
   npm run ios
   npm run web
   ```

### Configuration
- Make sure the backend Socket.IO server is running and accessible.
- Update the `API_URL` in `utils/api.ts` to match your backend server's address. For real devices, use your computer's local IP address (not `localhost`).

### Usage
- Launch the app on your emulator or physical device.
- Select a chat room from the list to join.
- Start sending and receiving messages in real time.

## Notes
- This project is for demonstration and educational purposes. For production use, consider adding authentication, message persistence, and security improvements.
- The backend server must implement the required REST and Socket.IO endpoints for full functionality.

## Author
- Nhat Thach

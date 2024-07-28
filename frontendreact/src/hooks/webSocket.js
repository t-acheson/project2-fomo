import { latLng } from "leaflet";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Singleton WebSocket Manager
let socket = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 5000; // milliseconds

const initializeWebSocket = async () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.warn('WebSocket already initialized and open.');
    return socket;
  }

  if (socket) {
    console.warn('Closing existing WebSocket connection.');
    socket.close();
  }

  socket = new WebSocket('wss://nycfomo.com/ws');

  socket.addEventListener('open', async (event) => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const fingerprint = result.visitorId;

    console.log("WebSocket connection established with server.");
    socket.send(JSON.stringify({
      lat: 40.6478277863495, // Example latitude
      lng: -73.98422384354889, // Example longitude
      fingerprint: fingerprint // Send fingerprint data
    }));
    // console.log('Location sent from:', fingerprint);
    reconnectAttempts = 0; // Reset reconnect attempts on successful connection
  });

  socket.addEventListener('message', function(event) {
    // console.log('Message from server:', event.data);
  });

  socket.addEventListener('error', function(event) {
    console.error('WebSocket error:', event);
  });

  socket.addEventListener('close', function(event) {
    console.log('WebSocket connection closed:', event);
    if (reconnectAttempts < maxReconnectAttempts) {
      console.log(`Reconnecting in ${reconnectDelay / 1000} seconds...`);
      setTimeout(() => {
        reconnectAttempts++;
        initializeWebSocket();
      }, reconnectDelay);
    } else {
      console.error('Max reconnect attempts reached. Unable to reconnect.');
    }
  });

  return socket;
};

// Function to send a message to the server
const sendMessage = (message) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error('WebSocket is not initialized or not open. Message not sent.');
    return;
  }

  console.log('Attempting to send message:', JSON.stringify(message));
  try {
    socket.send(JSON.stringify(message));
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// Function to listen for messages from the server
const listenForMessages = (callback) => {
  if (!socket) {
    console.error('WebSocket is not initialized.');
    return () => {};
  }

  const handleMessage = (event) => {
    try {
      const messageData = JSON.parse(event.data);
      callback(messageData);
    } catch (error) {
      console.error('Error parsing message data:', error);
    }
  };

  socket.addEventListener('message', handleMessage);

  return () => {
    socket.removeEventListener('message', handleMessage);
    if (socket) {
      socket.close();
      console.log('WebSocket connection closed.');
    }
  };
};

export { initializeWebSocket, sendMessage, listenForMessages };

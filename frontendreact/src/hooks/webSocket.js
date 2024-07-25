import { latLng } from "leaflet";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Singleton WebSocket Manager
let socket = null;

const initializeWebSocket = async () => {
  if (socket) {
    console.warn('WebSocket already initialized.');
    return;
  }

  socket = new WebSocket('wss://nycfomo.com/ws');

  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const fingerprint = result.visitorId;

    socket.onopen = function(event) {
      console.log("WebSocket connection established with server.");
      socket.send(JSON.stringify({
        lat: 40.6478277863495, // Example latitude
        lng: -73.98422384354889, // Example longitude
        fingerprint: fingerprint // Send fingerprint data
      }));
      console.log('Location sent from:', fingerprint);
    };

    socket.addEventListener('open', function(event) {
      console.log('WebSocket is connected.');
    });

    socket.addEventListener('message', function(event) {
      console.log('Message from server:', event.data);
    });

    socket.addEventListener('error', function(event) {
      console.error('WebSocket error:', event.data);
    });

    socket.addEventListener('close', function(event) {
      console.log('WebSocket connection closed:', event);
    });

  } catch (error) {
    console.error('Error initializing WebSocket:', error);
  }
};

// Function to send a message to the server
const sendMessage = (message) => {
  if (!socket) {
    console.error('WebSocket is not initialized.');
    return;
  }
  console.log('Attempting to send message:', JSON.stringify(message));
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
    console.log('Message sent successfully');
  } else {
    console.error('WebSocket is not open. Message not sent.');
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

// Ensure WebSocket is initialized when the module is loaded
initializeWebSocket();

export { sendMessage, listenForMessages };


const socket = new WebSocket('wss://nycfomo.com/ws');

// Connection opened
socket.addEventListener('open', function (event) {
    console.log('WebSocket is connected.');
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server:', event.data);
});

// Send message
const sendMessage = (message) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
      console.log('Sent message to server:', message);
    } else {
      console.error('WebSocket is not open. Unable to send message:', message);
    }
  };
  
export { sendMessage };
export default socket;

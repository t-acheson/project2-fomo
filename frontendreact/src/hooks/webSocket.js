const socket = new WebSocket('wss://nycfomo.com/ws');

// Connection opened
socket.addEventListener('open', function (event) {
    console.log('WebSocket is connected.');
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server:', event.data);
});

// Listen for errors
socket.addEventListener('error', function (event) {
    console.error('WebSocket error:', event);
});

// Listen for connection close
socket.addEventListener('close', function (event) {
    console.log('WebSocket connection closed:', event);
});

export default socket;

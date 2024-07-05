const socket = new WebSocket('wss://nycfomo.com/ws');

// Connection opened
socket.addEventListener('open', function (event) {
    console.log('WebSocket is connected.');
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server:', event.data);
});

export default socket;

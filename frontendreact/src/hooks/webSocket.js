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


// Function to send the user input message to the server
const sendMessage = (message) => {
    console.log('Attempting to send message:', JSON.stringify(message));  // Log before attempting to send
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
        console.log('Message sent successfully');  // Log on successful send
    } else {
        console.error('WebSocket is not open. Message not sent.');
    }
};


export default socket;
export { sendMessage };

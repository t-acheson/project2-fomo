import { latLng } from "leaflet";

const socket = new WebSocket('wss://nycfomo.com/ws');
// ================================
// 4 event listeners to console.log the WebSocket status
// ================================
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

// ! to change to real location sfter testing
const sendLocation = (location) => {
    socket.onopen = function(event) {
        console.log("WebSocket connection established with server.");
        socket.send(JSON.stringify({
            lat: 2,
            lng: 2
        }));
    };
}
// ================================
// Below are functions can be called in other files to interact with the WebSocket
// ================================
// 1. sendMessage: send a message to the server
const sendMessage = (message) => {
    console.log('Attempting to send message:', JSON.stringify(message));  // Log before attempting to send
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
        console.log('Message sent successfully');  // Log on successful send
    } else {
        console.error('WebSocket is not open. Message not sent.');
    }
};

//listenForMessages: listen for messages from the server
// When it is called ,it can pass back the message data 
const listenForMessages = (callback) => {
    const handleMessage = (event) => {
        try {
            const messageData = JSON.parse(event.data);
            callback(messageData);
        } catch (error) {
            console.error('Error parsing message data:', error);
        }
    };

    // Attach the event listener
    socket.addEventListener('message', handleMessage);

    // Return a cleanup function to close the WebSocket connection
    return () => {
        socket.removeEventListener('message', handleMessage);
        socket.close();
        console.log('WebSocket connection closed.');
    };
};


export default socket;
export { sendMessage };
export { listenForMessages };
export {sendLocation}

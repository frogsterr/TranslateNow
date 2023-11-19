document.addEventListener('DOMContentLoaded', () => {
    var videoButton = document.getElementById('videoTranslateButton');

    videoButton.addEventListener('click', () => {
        establishConnection('ws://localhost:8079');
    });
});


const establishConnection = endpoint => {
    //Creates socket object
    socket = new WebSocket(endpoint);

    //Connects to endpoint and verifies with text overlay
    socket.addEventListener('open', () => {
        newDiv = document.createElement('div');
        newDiv.textContent = 'Connected to server!';
        document.body.appendChild(newDiv);
        sendData("Client has sent a message!");

    });
};

function sendData(message) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    } else {
        newDiv.textContent = 'Error sending message!';
    };
};





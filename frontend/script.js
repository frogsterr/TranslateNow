document.addEventListener('DOMContentLoaded', () => {
    var videoButton = document.getElementById('videoTranslateButton');
    var videoOffButton = document.getElementById('videoOffButton');
    newDiv = document.createElement('div');

    videoButton.addEventListener('click', () => {

        establishConnection('ws://localhost:8079');

        videoButton.classList.remove("btn-outline-dark");
        videoButton.classList.add("btn-dark");
        if (videoOffButton.classList.contains("btn-dark")) {
            videoOffButton.classList.remove("btn-dark");
            videoOffButton.classList.add("btn-outline-dark");
        };

    });

    videoOffButton.addEventListener('click', () => {
        turnOffConnection(videoSocket);
        videoOffButton.classList.remove("btn-outline-dark");
        videoOffButton.classList.add("btn-dark");
        if (videoButton.classList.contains("btn-dark")) {
            videoButton.classList.remove("btn-dark");
            videoButton.classList.add("btn-outline-dark");
        };
    });
});


const establishConnection = endpoint => {
    //Creates socket object
    videoSocket = new WebSocket(endpoint);

    //Connects to endpoint and verifies with text overlay
    videoSocket.addEventListener('open', () => {
        newDiv.textContent = 'Connected to server!';
        document.body.appendChild(newDiv);
        sendData(videoSocket, "Client has connected!");

    });
};

const turnOffConnection = socket => {
    if (socket) {
        socket.close();
        newDiv.textContent = 'Disconnected from server.';
        console.log("connection closed");
    };
};

function sendData(socket, message) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    } else {
        newDiv.textContent = 'Error sending message!';
    };
};





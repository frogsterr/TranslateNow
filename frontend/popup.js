document.addEventListener('DOMContentLoaded', () => {

    popupText = document.createElement('div');
    const videoButton = document.getElementById('videoTranslateButton');
    const videoOffButton = document.getElementById('videoOffButton');
    var videoStream;

    //Remove Later
    const videoElement = document.getElementById('videoElement');


    videoButton.addEventListener('click', () => {
        //Establish Connection to Websocket
        establishConnection('ws://localhost:8079'); 

        //Get user video
        startVideoStream(); 

        //Toggle On-Off button colors
        onOffSwitch(onButton=videoButton, offButton=videoOffButton);
    });

    
    videoOffButton.addEventListener('click', () => {
        //Terminate WS connection
        turnOffConnection(videoSocket);

        //Turn off Video Stream
        stopVideoStream();

        //Toggle On-Off button colors
        onOffSwitch(onButton=videoOffButton, offButton=videoButton);
    });

});

//Toggle On-Off button colors
const onOffSwitch = (onButton, offButton) => {
    onButton.classList.remove("btn-outline-dark");
    onButton.classList.add("btn-dark");
    if (offButton.classList.contains("btn-dark")) {
        offButton.classList.remove("btn-dark");
        offButton.classList.add("btn-outline-dark");
        };
}

//Establishes websocket connection
const establishConnection = endpoint => {
    //Creates socket object
    videoSocket = new WebSocket(endpoint);

    //Connects to endpoint and verifies with text overlay
    videoSocket.addEventListener('open', () => {
        popupText.textContent = 'Connected to server!';
        document.body.appendChild(popupText);
        sendData(videoSocket, "Client has connected!");
        websocketExists = true;

    });

    //
    videoSocket.addEventListener("message", (r) => {
        console.log(r);
        popupText.textContent = `${r.data}`;
    });
};

//Turns off websocket connection
const turnOffConnection = socket => {
    if (websocketExists) {
        socket.close();
        websocketExists = false;
        popupText.textContent = 'Disconnected from server.';
        console.log("connection closed");
    } else {
        console.log("Connection Doesn't exist");
    }
};

//Sends message to socket
function sendData(socket, message) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    } else {
        popupText.textContent = 'Error sending message!';
    };
};

//Stops video stream
function stopVideoStream() {
        var tracks = videoStream.getTracks();
        tracks.forEach((track) => {
            track.stop();
        });
        videoStream = null;

        //REMOVE LATER
        popupText.textContent = 'Closed Stream';
};

//Starts video stream
const startVideoStream = () => {
    navigator.mediaDevices.getUserMedia({video: true}).then(function(stream) {

        //REMOVE LATER
        videoElement.srcObject = stream;

        videoStream = stream;
    }).catch(function() {
        alert('Unable to capture your camera.');
    });
};
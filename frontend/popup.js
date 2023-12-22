document.addEventListener('DOMContentLoaded', () => {

    const videoButton = document.getElementById('videoTranslateButton');
    const videoOffButton = document.getElementById('videoOffButton');
    const optionsButton = document.getElementById('goOptionsButton');
  
    //Asks Background.js if service is running.
    chrome.runtime.sendMessage({command: "validateState"});

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.command === 'serviceOn') {
            onOffSwitch(onButton=videoButton, offButton=videoOffButton);
        };
        if (request.command === 'serviceOff') {
            onOffSwitch(onButton=videoOffButton, offButton=videoButton);
        }
    });

    
    videoButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({command: "videoOnButtonClicked"});
    });

    
    videoOffButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({command: "videoOffButtonClicked"});
    }); 


    optionsButton.addEventListener('click', () => {
        //Create New Chrome Tab
        chrome.tabs.create({url:'options.html', pinned:false, active: true});
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

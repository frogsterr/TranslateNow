let websocketExists = false
let videoStreamExists = false


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    //Checks if Service is Currently Running. If it is, send serviceOn state to PopUp
    if (request.command === 'validateState') {
        if (websocketExists && videoStreamExists) {
            chrome.runtime.sendMessage({command: 'serviceOn'});
            console.log(`Pop-up Opened, all SHOULD work: Camera: ${videoStreamExists}, WebSocket: ${websocketExists}`);
        } else {
            console.log(`Pop-up Opened: Camera: ${videoStreamExists}, WebSocket: ${websocketExists}`);
        };
    };

    //If On Button is clicked on Pop-up, create recorder tab and startStream
    if (request.command === 'videoOnButtonClicked') {
            if (!videoStreamExists) {
                chrome.tabs.create({url:'recorder.html', pinned:true, active:false});
                chrome.runtime.sendMessage({command: 'startStream'});
                establishConnection("ws://localhost:8079/");
                chrome.runtime.sendMessage({command: 'serviceOn'});
            };
        };

    if (request.command ==='videoOffButtonClicked') {
        if (videoStreamExists && websocketExists) {

            //Close recorder tab
            chrome.tabs.query({url: "chrome-extension://fobmonohfpdlbbffbdpfbjhppkjaohkk/recorder.html"}, tabs => {
                    if (tabs.length > 0) {
                        recorderID = tabs[0].id;
                        chrome.tabs.remove(recorderID);
                        videoStreamExists = false;
                        videoStream = null;
                    };
            });

            //Turn off websocket connection
            turnOffConnection(videoSocket);
            chrome.runtime.sendMessage({command: 'serviceOff'});
            console.log(`ALL SHOULD BE OFF: Camera: ${videoStreamExists}, WebSocket: ${websocketExists}`);
        };
    };

    //If Recorder tab is streaming, videoStreamExists is true
    if (request.command === 'streamRunning') {
        videoStreamExists = true;
        videoStream = request.mediaStream;
        console.log(`Stream is running! Stream: ${videoStream}`);
    };

    if (request.command === 'cameraAllowed') {
        camAllowed = true;
    };
});

//If recorder tab is deleted, video stream is false.
chrome.tabs.onRemoved.addListener((recorderID, removeInfo) => {
    videoStreamExists = false;  
    videoStream = null;    
  });

//Establishes websocket connection
const establishConnection = endpoint => {
    if (!websocketExists) {
    //Creates socket object
    videoSocket = new WebSocket(endpoint);

    //Connects to endpoint and verifies with text overlay
    videoSocket.addEventListener('open', () => {
        sendData(videoSocket, "Background Client has connected!");
        websocketExists = true;

    });

    videoSocket.addEventListener("message", (r) => {
        console.log(r.data);
    });
    };
};

//Turns off websocket connection
const turnOffConnection = socket => {
    if (websocketExists) {
        socket.close();
        websocketExists = false;
        console.log("connection closed");
    } else {
        console.log("Connection Doesn't exist");
    };
};

//Sends message to socket
function sendData(socket, message) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    } else {
        console.log("some issue with sending data func");
    };
};

//Starts video stream
const startVideoStream = () => {
    if (!videoStreamExists) {
        navigator.mediaDevices.getUserMedia({video: true}).then(function(stream) {
            videoStream = stream;
            console.log(videoStream);
            videoStreamExists = true;
        }).catch(function() {
            alert('Unable to capture your camera.');
        });
    };
};

//Stops video stream
function stopVideoStream() {
    if (videoStreamExists) {
        var tracks = videoStream.getTracks();
        tracks.forEach((track) => {
            track.stop();
        });
        videoStream = null;
        videoStreamExists = false;
    };
};


let videoSocket = null;
let videoStream = null;

chrome.runtime.onMessage.addListener(request => {

    // Checks if Service is Currently Running. If it is, send serviceOn state to PopUp
    if (request.command === 'validateState') {
        if (videoSocket && videoStream) {
            chrome.runtime.sendMessage({ command: 'serviceOn' });
            console.log(`Pop-up Opened, all SHOULD work: Camera: ${!!videoStream}, WebSocket: ${!!videoSocket}`);
        } else {
            chrome.runtime.sendMessage({ command: 'serviceOff' });
            console.log(`Pop-up Opened: Camera: ${!!videoStream}, WebSocket: ${!!videoSocket}`);
        };
    };

    // Create recorder tab and connect to the server, then callback to ask recorder tab to start stream
    if (request.command === 'videoOnButtonClicked') {
        if (!videoSocket && !videoStream) {
            serviceOn(() => {
                if (videoSocket && videoStream) {
                    chrome.runtime.sendMessage({ command: 'startStream'});
                };
            });
        };
    };

    //If service is on, delete recorder tab and disconnect from websocket
    if (request.command === 'videoOffButtonClicked') {
        if (videoStream && videoSocket) {
            // Close recorder tab
            chrome.tabs.query({ url: "chrome-extension://fobmonohfpdlbbffbdpfbjhppkjaohkk/recorder.html" }, tabs => {
                if (tabs.length > 0) {
                    recorderID = tabs[0].id;
                    chrome.tabs.remove(recorderID);
                    videoStream = null;
                };
                //Turn off websocket connection
                turnOffConnection(videoSocket);
                chrome.runtime.sendMessage({ command: 'serviceOff' });
            })
        };
    };
    //If stream is not on, turn-on and toggle button. Else, service should already be on, continue stream.
    if (request.command === 'streamRunning') {
        if (!videoStream) {
            chrome.runtime.sendMessage({ command: 'serviceOn' });
        };

        videoStream = request.base64Stream;
        console.log(videoStream);
    };
});

// If the recorder tab is deleted, the video stream is false.
chrome.tabs.onRemoved.addListener((recorderID, removeInfo) => {
    videoStream = null;
});

// Establishes websocket connection
const establishConnection = endpoint => {
    if (!videoSocket) {
        try {
            // Creates socket object
            videoSocket = new WebSocket(endpoint);

            // Connects to endpoint and verifies with text overlay
            videoSocket.addEventListener('open', () => {
                sendData(videoSocket, "Background Client has connected!");
            });

            // WS Error event
            videoSocket.onerror = error => {
                console.error(`ERROR STARTING WS: ${error}`);
                videoSocket = null;
            };

            // Listening for server message
            videoSocket.addEventListener("message", (r) => {
                console.log(r.data);
            });

            //catch error with creating WS object (ex: WS isn't active.) ~~~~~!!
        } catch (error) {
            console.error(error);
            videoSocket = null;
        };
    };
};

// Turns off websocket connection
const turnOffConnection = socket => {
    if (socket) {
        socket.close();
        videoSocket = null;
        console.log("connection closed");
    } else {
        console.log("Connection Doesn't exist");
    };
};

// Sends a message to the socket
function sendData(socket, message) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    } else {
        console.error("Socket not open, error sending message.");
    };
};

// Starts video stream
const startVideoStream = () => {
    if (!videoStream) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
            videoStream = stream;
            console.log(videoStream);
        }).catch(function () {
            alert('Unable to capture your camera.');
        });
    };
};

// Stops video stream
function stopVideoStream() {
    if (videoStream) {
        chrome.runtime.sendMessage({command: 'stopStream'});
        };
        videoStream = null;
    };

//Opens recorder tab and establishes WS conn.
const serviceOn = () => {
    chrome.tabs.create({ url: 'recorder.html', pinned: true, active: false });
    establishConnection("ws://localhost:8079/");
};

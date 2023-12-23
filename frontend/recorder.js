document.addEventListener('DOMContentLoaded', () => {
        //Records user video
        navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
        
        const videoElement = document.createElement('video');
        videoElement.srcObject = stream

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        //Every 100 ms grab from video and convert to Base64 -> Background.js
        setInterval(() => {
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            let base64Data = canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, '');
            chrome.runtime.sendMessage({command: "streamRunning", base64Stream: base64Data});
        }, 100);

        videoElement.play();

        chrome.runtime.onMessage.addListener(request => {
            if (request.command === 'stopStream') {
                stopVideoStream();
            };
        });

        }).catch(() => {
            alert('Unable to capture your camera.');
        });
});

function stopVideoStream(stream) {
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
};
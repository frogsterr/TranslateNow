document.addEventListener('DOMContentLoaded', () => {
        navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
            chrome.runtime.sendMessage({command: "streamRunning", mediaStream: stream});
        }).catch(function() {
            alert('Unable to capture your camera.');
        });
});
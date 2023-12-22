document.addEventListener('DOMContentLoaded', () => {
    navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
        chrome.runtime.sendMessage({command: "camAllowed", mediaStream: stream});
    }).catch(function() {
        alert('Unable to capture your camera.');
    });
});
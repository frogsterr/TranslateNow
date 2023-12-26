document.addEventListener('DOMContentLoaded', () => {

    const videoButton = document.getElementById('videoTranslateButton');
    const videoOffButton = document.getElementById('videoOffButton');
    const optionsButton = document.getElementById('goOptionsButton');
    let popupText = document.getElementById('popupText');
  
    //Asks Background.js if service is running.
    chrome.runtime.sendMessage({command: "validateState"});

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.command === 'serviceOn') {
            onOffSwitch(onButton=videoButton, offButton=videoOffButton);
            popupText.textContent = 'Connected, Sign Away! ✌️';
        };
        if (request.command === 'serviceOff') {
            onOffSwitch(onButton=videoOffButton, offButton=videoButton);
            popupText.textContent = '';
        };
    });

    //Background.js -> turns ON service
    videoButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({command: "videoOnButtonClicked"});
        popupText.textContent = 'Connecting...';
    });

    //Background.js -> turns OFF service
    videoOffButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({command: "videoOffButtonClicked"});
        popupText.textContent = 'Turning Off...';
    }); 

    //Opens Options tab
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

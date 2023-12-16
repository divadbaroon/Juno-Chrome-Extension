chrome.commands.onCommand.addListener((command) => {
    if (command === "open-google") { 
        chrome.tabs.create({ url: 'https://www.google.com/' }); 
    }
  });

// Function to send the selected text to the server
function sendTextToApi(text) {
    fetch('http://localhost:8000/process/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text })
    })
    .then(response => response.json())
    .then(data => console.log("Processed text:", data.processed_text))
    .catch(error => console.error('Error:', error));
}

// Creating a context menu on extension installation
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: "sendToApi",
        title: "Send to Juno",
        contexts: ["selection"]
    });
});

// Listening for context menu click
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "sendToApi" && info.selectionText) {
        sendTextToApi(info.selectionText);
    }
});

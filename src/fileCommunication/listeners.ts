
import { initializeData } from '../initializer/initializeData';
import { generateResponse } from '../functions/llmInteraction/performllmInteraction';
import { recognizeIntent } from '../functions/intentRecognition/performIntentRecognition'
import { openWebpage, performGoogleSearch } from '../extensions/background/webBrowser/performWebBrowsing'
import { performYouTubeSearch } from '../extensions/background/youtubeBrowser/performYoutubeBrowsing'
import { captureScreenshot } from '../extensions/background/screenCapture/performScreenCapture'

/*
handles various message-based actions for the extension, including:
  - Initializing data
  - Generating responses using LLM
  - Recognizing intents
  - Performing web and YouTube searches
  - Capturing screenshots
*/
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("Received message in background:", message);

  if (message.action === "initializeData") {
    initializeData()
      .then(data => {
        console.log("Sending initialized data to content script");
        sendResponse({ success: true, data });
      })
      .catch(error => {
        console.error("Error initializing data:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  } 
  
  else if (message.action === "generateResponse") {
    console.log("Generating response for:", message.usersSpeech);
    generateResponse(message.usersSpeech, message.prompt, message.apiKey, message.additionalInformation, message.fileURL)
      .then(response => {
        console.log("Sending generated response to content script:", response);
        sendResponse({ success: true, response });
      })
      .catch(error => {
        console.error("Error in generateResponse:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  else if (message.action === "recognizeIntent" && message.text) {
    recognizeIntent(message.text, message.secrets)
      .then(result => {
        sendResponse({ success: true, result: result });  
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true;  
  }
  
  else if (message.action === "open_webpage") {
    openWebpage(message.url).then((result) => {
      console.log('Sending response for open_webpage:', result);
      sendResponse(result);
    });
    return true; 
  }

  else if (message.action === "perform_google_search") {
    performGoogleSearch(message.query).then((result) => {
      console.log('Sending response for perform_google_search:', result);
      sendResponse(result);
    });
    return true; 
  }

  else if (message.action === "perform_youtube_search") {
    performYouTubeSearch(message.query).then((result) => {
      console.log("YouTube search result:", result);
      sendResponse(result);
    });
    return true; 
  }

  else if (message.action === "capture_screenshot") {
    captureScreenshot().then(sendResponse);
    return true;
  }

  else {
    console.log("Unknown message action:", message.action);
    sendResponse({ success: false, error: 'Unknown action' });
  }

  return true;
});

console.log("Background script loaded");
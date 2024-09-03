import { Profile, Secrets, Prompt, GenerateResponseResult, IntentResult, BackgroundResponse, ExtensionResult } from '../types';
import { streamAudio, stopAudio } from '../functions/textToSpeech/performTextToSpeech';

// @ts-ignore
import { GoogleSpeechRecognition } from 'google-cloud-speech-webaudio';

import { handleExtensionCalls } from '../functions/callExtension/handleExtensionCalls';

let isShortcutActive = false;
let speechRecognition: GoogleSpeechRecognition | null = null;
let secrets: Secrets | null = null;
let selectedProfile: Profile | null = null;
let prompt: Prompt | null = null;
let voiceId: string;
let shortcut = "CTRL + SHIFT + S";
let currentlyPlaying = false


// Parse shortcut string into an object
function parseShortcut(shortcutString: string) {
  const keys = shortcutString.toUpperCase().split('+').map(key => key.trim());
  return {
    ctrl: keys.includes('CTRL'),
    shift: keys.includes('SHIFT'),
    alt: keys.includes('ALT'),
    key: keys.find(key => !['CTRL', 'SHIFT', 'ALT'].includes(key)) || ''
  };
}

// Add event listeners for shortcut
document.addEventListener('keydown', ListenForKeyDown);
document.addEventListener('keyup', ListenForKeyUp);

// Listen for if the user is holding key down
function ListenForKeyDown(event: KeyboardEvent) {
  if (currentlyPlaying) {
    stopAudio()
  }

  const parsedShortcut = parseShortcut(shortcut);
  if (event.ctrlKey === parsedShortcut.ctrl &&
      event.shiftKey === parsedShortcut.shift &&
      event.altKey === parsedShortcut.alt &&
      event.key.toUpperCase() === parsedShortcut.key) {
    event.preventDefault();
    if (!isShortcutActive) {
      isShortcutActive = true;
      currentlyPlaying = true;
      startInteraction();
    }
  }
}

// Listen for if the user stopped holding the key down
function ListenForKeyUp(event: KeyboardEvent) {
  const parsedShortcut = parseShortcut(shortcut);
  if (event.key.toUpperCase() === parsedShortcut.key) {
    isShortcutActive = false;
    stopInteraction();
  }
}

// In your startInteraction function:
async function startInteraction() {
    console.log('Interaction started');
    
    const data = await initializeData();
    if (!data) {
      console.error('Failed to retrieve initialized data');
      isShortcutActive = false;
      return;
    }
  
    shortcut = data.shortcut;
    secrets = data.secrets;
    selectedProfile = data.profile;
    voiceId = data.voice.voiceId;
    prompt = data.prompt;
  
    console.log('Initialized data:', { secrets, selectedProfile, voiceId, prompt });
  
    speechRecognition = new GoogleSpeechRecognition(secrets.GoogleSpeechAPI, secrets.GoogleSpeechEndpoint);
  
    console.log('Listening...')
  
    try {
      await speechRecognition.startListening();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      isShortcutActive = false;
      speechRecognition = null;
    }
  }

  async function stopInteraction() {
    console.log('Interaction stopped');
    if (speechRecognition && secrets && prompt) {
      try {
        const result = await speechRecognition.stopListening();
        const userSpeech = result.results[0].alternatives[0].transcript;
        console.log('User speech:', userSpeech);
        let response = '';
        let extensionResult: ExtensionResult | null = null;
  
        if (userSpeech) {
          try {
            let intentRecognized = await sendIntentRecognitionMessage(userSpeech);
            console.log(intentRecognized);
            
            if (intentRecognized.confidence > 0.70) {
              extensionResult = await handleExtensionCalls(intentRecognized);
            }
          } catch (intentError) {
            console.error('Error during intent recognition:', intentError);
          }
        }
  
        if (extensionResult && extensionResult.extensionResponse != 'ignore') {
          console.log("EXTENSION RESULT:", extensionResult.extensionResponse, extensionResult.queryLLM, extensionResult.fileURL);
          if (extensionResult.queryLLM) {
            // Query LLM with extension result as additional context
            const llmResponse = await getLLMResponse(
              userSpeech, 
              prompt, 
              secrets.OpenAI, 
              extensionResult.extensionResponse,
              extensionResult.fileURL
            );
            response = llmResponse.response || '';
          } else {
            response = extensionResult.extensionResponse;
          }
        }
  
        // If no response from extension or LLM yet, query LLM without additional context
        if (!response && extensionResult?.extensionResponse != 'ignore') {
          const llmResponse = await getLLMResponse(userSpeech, prompt, secrets.OpenAI);
          response = llmResponse.response || '';
        }
  
        if (response) {
          console.log('Response:', response);
          await streamAudio(response, voiceId, secrets.Elevenlabs);
          currentlyPlaying = false;
        } else {
          console.error('No response generated');
        }
  
      } catch (error) {
        console.error('Error in stopInteraction:', error);
      } finally {
        speechRecognition = null;
      }
    } else {
      console.log('No active speech recognition to stop');
    }
  }

async function initializeData(): Promise<{shortcut: string, secrets: Secrets; profile: Profile; voice: any, prompt: any} | null> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "initializeData" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error getting initialized data:", chrome.runtime.lastError);
          resolve(null);
        } else if (!response.success) {
          console.error("Error initializing data:", response.error);
          resolve(null);
        } else {
          resolve(response.data);
        }
      });
    });
  }

async function getLLMResponse(usersSpeech: string, prompt: Prompt, openAIKey: string, additionalInformation?: string, fileURL?: string): Promise<GenerateResponseResult> {
    console.log("Sending message to generate response:", { usersSpeech, prompt, openAIKey });
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({
            action: "generateResponse",
            usersSpeech: usersSpeech,
            prompt: prompt,
            apiKey: openAIKey,
            additionalInformation: additionalInformation,
            fileURL: fileURL
        }, (response) => {
            console.log("Received response from background script:", response);
            if (chrome.runtime.lastError) {
                console.error("Runtime error:", chrome.runtime.lastError);
                resolve({ success: false, error: chrome.runtime.lastError.message });
            } else if (!response) {
                console.error("Received null response");
                resolve({ success: false, error: "Null response from background script" });
            } else {
                resolve(response as GenerateResponseResult);
            }
        });
    });
}

// Initialize the users designated shortcut on reload
async function initialize() {
  const data = await initializeData();
  if (data) {
    shortcut = data.shortcut;
    console.log("Initial shortcut loaded:", shortcut);
  } else {
    console.error("Failed to load initial data");
  }
  chrome.runtime.sendMessage({ action: "contentScriptReady" });
}

initialize();

chrome.runtime.sendMessage({ action: "contentScriptReady" });

async function sendIntentRecognitionMessage(text: string): Promise<IntentResult> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: "recognizeIntent",
      text: text
    }, (response: BackgroundResponse) => {
      console.log("Received response from background script:", response);
      if (chrome.runtime.lastError) {
        console.error("Runtime error:", chrome.runtime.lastError);
        reject(new Error(chrome.runtime.lastError.message));
      } else if (!response) {
        console.error("Received null response");
        reject(new Error("Null response from background script"));
      } else if (!response.success) {
        reject(new Error(response.error || "Unknown error occurred"));
      } else if (response.result && 'intent' in response.result && 'confidence' in response.result) {

        // The intent result is in the 'result' property
        const intentResult: IntentResult = {
          intent: response.result.intent,
          confidence: response.result.confidence
          
        };
        if ('topEntity' in response.result && response.result.topEntity) {
          intentResult.topEntity = response.result.topEntity;
        }
        resolve(intentResult);
      } else {
        reject(new Error("Invalid intent result structure"));
      }
    });
  });
}
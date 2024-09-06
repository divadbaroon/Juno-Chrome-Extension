import { Secrets, Prompt } from '../../types';

// @ts-ignore
import { GoogleSpeechRecognition } from 'google-cloud-speech-webaudio';

// Global state variables
let shortcut = "CTRL + SHIFT + S";
let isShortcutActive = false;
let secrets: Secrets;
let voiceId: string;
let prompt: Prompt;

/**
 * Parses a shortcut string into an object representation
 */
function parseShortcut(shortcutString: string) {
  const keys = shortcutString.toUpperCase().split('+').map(key => key.trim());
  return {
    ctrl: keys.includes('CTRL'),
    shift: keys.includes('SHIFT'),
    alt: keys.includes('ALT'),
    key: keys.find(key => !['CTRL', 'SHIFT', 'ALT'].includes(key)) || ''
  };
}

/**
 * Listens for the shortcut key combination being pressed down
 */
function listenForKeyDown(event: KeyboardEvent, callback: () => void) {
  const parsedShortcut = parseShortcut(shortcut);
  if (event.ctrlKey === parsedShortcut.ctrl &&
      event.shiftKey === parsedShortcut.shift &&
      event.altKey === parsedShortcut.alt &&
      event.key.toUpperCase() === parsedShortcut.key) {
    event.preventDefault();
    if (!isShortcutActive) {
      isShortcutActive = true;
      callback();
    }
  }
}

/**
 * Listens for the shortcut key being released
 */
function listenForKeyUp(event: KeyboardEvent, callback: () => void) {
  const parsedShortcut = parseShortcut(shortcut);
  if (event.key.toUpperCase() === parsedShortcut.key) {
    isShortcutActive = false;
    callback();
  }
}

/**
 * Initializes the shortcut listener with the provided configuration and callbacks
 */
export function initializeShortcutListener(
    speechRecognition: GoogleSpeechRecognition,
    initialShortcut: string,
    initialSecrets: Secrets,
    initialVoiceId: string,
    initialPrompt: Prompt,
    startInteractionCallback: (speechRecognition: GoogleSpeechRecognition) => void,
    produceResponseCallback: (speechRecognition: GoogleSpeechRecognition, secrets: Secrets, voiceId: string, prompt: Prompt) => void,
  ) {
    shortcut = initialShortcut;
    secrets = initialSecrets;
    voiceId = initialVoiceId;
    prompt = initialPrompt;
    
    const startInteractionWrapper = () => {
      startInteractionCallback(speechRecognition);
    };
  
    const produceResponseWrapper = () => {
        produceResponseCallback(speechRecognition, secrets, voiceId, prompt);
    };
  
    document.addEventListener('keydown', (event) => listenForKeyDown(event, startInteractionWrapper));
    document.addEventListener('keyup', (event) => listenForKeyUp(event, produceResponseWrapper));
  }
  
  /**
 * Updates the shortcut string.
 */
  export function updateShortcut(newShortcut: string) {
    shortcut = newShortcut;
  }
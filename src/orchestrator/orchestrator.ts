
// Used to listen for the user's key strokes
// If the user presses and holds their deignated shortcut, interaction with Juno begins
import { initializeShortcutListener } from '../functions/shortcutListener/listenForShortcut';

// Used for speech recognition
// @ts-ignore
import { GoogleSpeechRecognition } from 'google-cloud-speech-webaudio';

import { requestInitialData, // Used to initialize necessary user data such as designated shortcut, secrets, voiceID, etc
         requestIntentRecognition, // Used to perform intent recognition on user's speech
         requestLLMResponse, // Queries the user's selected large langauge model
        } from '../fileCommunication/messengers' // Used to send message to background script to execute these functions

// Used to handle call to extensions, depending on the user's intent
import { handleExtensionCalls } from '../functions/callExtension/handleExtensionCalls';

// Stream's audio for text-to-speech using Elevenlabs
import { streamAudio } from '../functions/textToSpeech/performTextToSpeech';

import { Secrets, Prompt, ExtensionResult } from '../types';

// Saving additional information globally 
// Additional information is information returned from extensions (such content from the user's screen)
let sustainedAdditonalInformation = ''

/* 
Initializes necessary user data including their selected shortcut (for interaction with Juno), 
secrets (API keys and end points), voiceID (for text-to-speech), and prompt (prompt used to query LLM)
*/
async function initialize() {
  let speechRecognition: GoogleSpeechRecognition | null = null;
  const data = await requestInitialData();
  if (data) {
    speechRecognition = new GoogleSpeechRecognition(data.secrets.GoogleSpeechAPI, data.secrets.GoogleSpeechEndpoint);
    initializeShortcutListener(
      speechRecognition,
      data.shortcut,
      data.secrets,
      data.voice.voiceId,
      data.prompt,
      startInteraction,
      produceResponse
    );
    console.log("Initial shortcut loaded:", data.shortcut);
  } else {
    console.error("Failed to load initial data");
  }
}

/*
Begins listening for user input upon the user pressing their assigned shortcut
*/
async function startInteraction(speechRecognition: GoogleSpeechRecognition) {
  try {
    console.log('Listening...')
    await speechRecognition.startListening();
  } catch (error) {
    console.error('Error starting speech recognition:', error);
    speechRecognition = null;
  }
}

/*
Processes and produces a response to the users input

Using the following workflow:

recieve user speech using Google Cloud Speech-to-Text -> Recieve user's intent by quering Azure's CLU intent recognition using user's speech
-> Execute extension (If applicable, this depends on the intent of the user) -> Query LLM using user's input and response from extension (if applicable)
-> Finally perform Text-to-Speech on the LLM's response
*/
async function produceResponse(speechRecognition: GoogleSpeechRecognition, secrets: Secrets, voiceId: string, prompt: Prompt, guiInput?: string) {
  try {
    let userInput: string;

    // if user input is coming from GUI use that instead of speech recognition result
    if (guiInput) {
        userInput = guiInput;
        console.log('User GUI input:', userInput);
    } else {
        // get user's speech using Google Cloud Speech-to-Text
        const result = await speechRecognition.stopListening();
        userInput = result.results[0].alternatives[0].transcript;
        console.log('User speech:', userInput);
    }

    let response = '';
    let extensionResult: ExtensionResult | null = null;

    // If the user's input is detected, perform intent recognition on it
    if (userInput) {
        try {
            let intentRecognized = await requestIntentRecognition(userInput, secrets);
            console.log(intentRecognized);
            
            // if the confidence level for the detected intent is higher than 85% , call the extension
            // (Will adjust this in the future to be much higher, this will require more time improving training data for model)
            if (intentRecognized.confidence > 0.85) {
                extensionResult = await handleExtensionCalls(intentRecognized);
            }
        } catch (intentError) {
            console.error('Error during intent recognition:', intentError);
        }
    }

      // If a response if recieved from the extension, it will be used as context to the LLM or solely used as the response if queryLLM is set to False
      if (extensionResult && extensionResult.extensionResponse != 'ignore') {
        console.log("EXTENSION RESULT:", extensionResult.extensionResponse, extensionResult.queryLLM, extensionResult.fileURL);

        if (extensionResult.queryLLM) {

          // if new additional information is recieved, save it 
          if (extensionResult.extensionResponse) {
            sustainedAdditonalInformation = extensionResult.extensionResponse
          }

          console.log("AdditionalInformation" + sustainedAdditonalInformation)

          // Query LLM with extension result as additional context
          const llmResponse = await requestLLMResponse(
            userInput, 
            prompt, 
            secrets.OpenAI, 
            sustainedAdditonalInformation ,
            extensionResult.fileURL
          );
          response = llmResponse.response || '';
        } else {
          // if queryLLM is set to False, use the extensions response as the response
          response = extensionResult.extensionResponse;
        }
      }

      // If no response from extension, query LLM without additional context
      if (!response && extensionResult?.extensionResponse != 'ignore') {
        const llmResponse = await requestLLMResponse(userInput, prompt, secrets.OpenAI, sustainedAdditonalInformation);
        response = llmResponse.response || '';
      }

      // If a response is recieved, perform text-to-speech on it using Elevenlabs
      if (response) {
        console.log('Response:', response);
        if (!guiInput) {
          await streamAudio(response, voiceId, secrets.Elevenlabs);
        }
      } else {
        console.error('No response generated');
      }

      return response;

    } catch (error) {
      console.error('Error in stopInteraction:', error);
    } finally {
      if (!guiInput) {
        speechRecognition = null;
      }
    } 
}


initialize();
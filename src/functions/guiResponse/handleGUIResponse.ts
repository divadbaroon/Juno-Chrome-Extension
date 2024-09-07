import { requestInitialData, // Used to initialize necessary user data such as designated shortcut, secrets, voiceID, etc
  requestIntentRecognition, // Used to perform intent recognition on user's speech
  requestLLMResponse, // Queries the user's selected large langauge model
} from '../../fileCommunication/messengers' // Used to send message to background script to execute these functions

// Used to handle call to extensions, depending on the user's intent
import { handleExtensionCalls } from '../../functions/callExtension/handleExtensionCalls';

import { ExtensionResult } from '../../types';

let sustainedAdditionalInformation = '';

export async function getGuiResponse(input: string): Promise<void> {
  const data = await requestInitialData();

  if (!data) {
      sendResponse("Error receiving secret data.", null);
      return;
  }

  const profileName = data.profile.name;

  try {
      let response = '';
      let extensionResult: ExtensionResult | null = null;

      if (input) {
          try {
              let intentRecognized = await requestIntentRecognition(input, data.secrets);
              console.log("Intent Recognized:", intentRecognized);
              
              if (intentRecognized.confidence > 0.85) {
                  extensionResult = await handleExtensionCalls(intentRecognized);
              }
          } catch (intentError) {
              console.error('Error during intent recognition:', intentError);
          }
      }

      if (extensionResult && extensionResult.extensionResponse !== 'ignore') {
          console.log("EXTENSION RESULT:", extensionResult.extensionResponse, extensionResult.queryLLM, extensionResult.fileURL);

          if (extensionResult.queryLLM) {
              if (extensionResult.extensionResponse) {
                  sustainedAdditionalInformation = extensionResult.extensionResponse;
              }

              console.log("AdditionalInformation:", sustainedAdditionalInformation);

              const llmResponse = await requestLLMResponse(
                  input, 
                  data.prompt, 
                  data.secrets.OpenAI, 
                  sustainedAdditionalInformation,
                  extensionResult.fileURL
              );
              response = llmResponse.response || '';
          } else {
              response = extensionResult.extensionResponse;
          }
      }

      if (!response && extensionResult?.extensionResponse !== 'ignore') {
          const llmResponse = await requestLLMResponse(input, data.prompt, data.secrets.OpenAI, sustainedAdditionalInformation);
          response = llmResponse.response || '';
      }

      sendResponse(response || "Sorry, I couldn't generate a response.", profileName);
  } catch (error) {
      console.error('Error in getGuiResponse:', error);
      sendResponse("An error occurred while processing your request.", profileName);
  }
}

function sendResponse(response: string, profileName: string | null) {
  window.postMessage({ 
      type: 'FROM_CONTENT', 
      action: 'GUI_RESPONSE', 
      response, 
      profileName 
  }, '*');
}

// Listen for messages from the React component
window.addEventListener('message', async (event) => {
  if (event.source === window && event.data && event.data.type === 'FROM_REACT') {
      if (event.data.action === 'GET_GUI_RESPONSE') {
          try {
              await getGuiResponse(event.data.input);
          } catch (error) {
              console.error('Error in getGuiResponse:', error);
              const data = await requestInitialData();
              const profileName = data?.profile.name || null;
              sendResponse("An error occurred while processing your request.", profileName);
          }
      }
  }
});
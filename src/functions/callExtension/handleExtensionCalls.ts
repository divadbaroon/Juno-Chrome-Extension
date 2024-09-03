import { IntentResult, ExtensionResult } from '../../types'
import { getSelectedText } from '../../extensions/content/textReader/performTextReading'

export async function handleExtensionCalls(intentRecognized: IntentResult): Promise<ExtensionResult> {
  console.log("Handling intent:", intentRecognized.intent);
  console.log("Full intent result:", intentRecognized);

  if (!intentRecognized || typeof intentRecognized !== 'object') {
    console.error("Invalid intentRecognized object:", intentRecognized);
    return { extensionResponse: "Invalid intent object", queryLLM: true };
  }

  switch (intentRecognized.intent) {
    case 'Open_Website':
      return await handleOpenWebsite(intentRecognized);
    case 'Search_Google':
      return await handleGoogleSearch(intentRecognized);
    case 'Search_Youtube':
      return await handleYouTubeSearch(intentRecognized);
    case 'ScreenCapture':
      return await handleCaptureScreenshot(intentRecognized);
    case 'textReader':
      return await handleTextReader(intentRecognized);
    default:
      console.log("Unknown intent:", intentRecognized.intent);
      return { extensionResponse: "Unknown intent", queryLLM: true };
  }
}

async function handleOpenWebsite(intentResult: IntentResult): Promise<ExtensionResult> {
  if (intentResult.topEntity && intentResult.topEntity.category === 'website') {
    console.log("Opening website:", intentResult.topEntity.text);
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "open_webpage", url: intentResult.topEntity!.text }, (response: ExtensionResult) => {
        if (chrome.runtime.lastError) {
          console.error("Error opening website:", chrome.runtime.lastError);
          resolve({ extensionResponse: "Error opening website", queryLLM: true });
        } else {
          console.log("Response from background script:", response);
          resolve(response);
        }
      });
    });
  } else {
    console.error('No valid website entity found');
    return { extensionResponse: "No valid website found", queryLLM: true };
  }
}

async function handleGoogleSearch(intentResult: IntentResult): Promise<ExtensionResult> {
  if (intentResult.topEntity && intentResult.topEntity.category === 'google_query') {
    console.log("Performing Google search for:", intentResult.topEntity.text);
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "perform_google_search", query: intentResult.topEntity!.text }, (response: ExtensionResult) => {
        if (chrome.runtime.lastError) {
          console.error("Error performing Google search:", chrome.runtime.lastError);
          resolve({ extensionResponse: "Error performing Google search", queryLLM: true });
        } else {
          console.log("Response from background script:", response);
          resolve(response);
        }
      });
    });
  } else {
    console.error('No valid search query entity found');
    return { extensionResponse: "No valid Google search query found", queryLLM: true };
  }
}

async function handleYouTubeSearch(intentResult: IntentResult): Promise<ExtensionResult> {
  if (intentResult.topEntity && intentResult.topEntity.category === 'youtube_query') {
    console.log("Performing YouTube search for:", intentResult.topEntity.text);
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "perform_youtube_search", query: intentResult.topEntity!.text }, (response: ExtensionResult) => {
        if (chrome.runtime.lastError) {
          console.error("Error performing YouTube search:", chrome.runtime.lastError);
          resolve({ extensionResponse: "Error performing YouTube search", queryLLM: true });
        } else {
          console.log("Response from background script:", response);
          resolve(response);
        }
      });
    });
  } else {
    console.error('No valid search query entity found');
    return { extensionResponse: "No valid YouTube search query found", queryLLM: true };
  }
}

async function handleCaptureScreenshot(_intentResult: IntentResult): Promise<ExtensionResult> {
  console.log("Capturing screenshot");
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "capture_screenshot" }, (response: ExtensionResult) => {
      if (chrome.runtime.lastError) {
        console.error("Error capturing screenshot:", chrome.runtime.lastError);
        resolve({ extensionResponse: "Error capturing screenshot", queryLLM: true });
      } else {
        console.log("Screenshot captured:", response);
        resolve(response);
      }
    });
  });
}

async function handleTextReader(_intentResult: IntentResult): Promise<ExtensionResult> {
  try {
    const result = await getSelectedText();
    if (result && typeof result === 'object' && 'extensionResponse' in result) {
      return {
        extensionResponse: `Selected text: ${result.extensionResponse}`,
        queryLLM: result.queryLLM ?? false
      };
    } else {
      return { extensionResponse: "No text selected or invalid response", queryLLM: true };
    }
  } catch (error) {
    console.error('Error getting selected text:', error);
    return { extensionResponse: "Error reading selected text", queryLLM: true };
  }
}
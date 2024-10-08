import { ExtensionResult } from '../../../types';

/*
ScreenCapture Extension: Capture's a screensot of the user's screen and automatically includes it as context to the LLM
*/
export async function captureScreenshot(): Promise<ExtensionResult> {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];

    if (!activeTab.id) {
      console.error("No active tab found.");
      return { extensionResponse: "No active tab found", queryLLM: true };
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      chrome.tabs.captureVisibleTab(activeTab.windowId, { format: 'png' }, (dataUrl) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (dataUrl) {
          resolve(dataUrl);
        } else {
          reject(new Error("Failed to capture screenshot."));
        }
      });
    });

    console.log("Screenshot captured");

    return {
      extensionResponse: "Screenshot captured",
      queryLLM: true,
      fileURL: dataUrl  
    };

  } catch (error) {
    console.error("Error capturing screenshot:", error);
    return { extensionResponse: "Error capturing screenshot", queryLLM: true };
  }
}


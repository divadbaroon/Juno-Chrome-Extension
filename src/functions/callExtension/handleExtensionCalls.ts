
// Importing background extensions (background extensions are communicated with using chrome messages)
import { handleWebsiteOpen, handleGoogleSearch, handleYouTubeSearch, handleScreenshotCapture } from '../../fileCommunication/messengers'

// Importing content extensions 
import { getSelectedText } from '../../extensions/content/textReader/performTextReading'
import { performYoutubeQA } from '../../extensions/content/youtubeQA/performYoutubeQA';
import { handleShowUI } from '../../extensions/content/showUI/injectChatInterface';

import { IntentResult, ExtensionResult } from '../../types'

/*
Takes intent recieved from Azure CLU and executes the appropriate extension
*/
export async function handleExtensionCalls(intentRecognized: IntentResult): Promise<ExtensionResult> {
  console.log("Handling intent:", intentRecognized.intent);
  console.log("Full intent result:", intentRecognized);

  switch (intentRecognized.intent) {
    case 'Open_Website':
      return await handleWebsiteOpen(intentRecognized);
    case 'Search_Google':
      return await handleGoogleSearch(intentRecognized);
    case 'Search_Youtube':
      return await handleYouTubeSearch(intentRecognized);
    case 'ScreenCapture':
      return await handleScreenshotCapture(intentRecognized);
    case 'textReader':
      return await getSelectedText();
    case 'YoutubeQA':
      return await performYoutubeQA ();
    case 'ShowUI':
      return await handleShowUI();
    default:
      console.log("Unknown intent:", intentRecognized.intent);
      return { extensionResponse: "Unknown intent", queryLLM: true };
  }
}



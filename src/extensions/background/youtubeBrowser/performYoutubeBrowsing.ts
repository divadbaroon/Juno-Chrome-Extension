import { ExtensionResult } from '../../../types'; 

// Function to perform a YouTube search
export async function performYouTubeSearch(query: string): Promise<ExtensionResult> {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  await chrome.tabs.create({ url: searchUrl });
  console.log(`Performed YouTube search for: ${query}`);
  return {
    extensionResponse: `ignore`,
    queryLLM: false
  };
}
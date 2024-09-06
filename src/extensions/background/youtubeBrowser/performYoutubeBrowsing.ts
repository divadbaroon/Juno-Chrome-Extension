import { ExtensionResult } from '../../../types'; 

/*
Youtube Extension: Perform's a given Youtube query
*/
export async function performYouTubeSearch(query: string): Promise<ExtensionResult> {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  await chrome.tabs.create({ url: searchUrl });
  console.log(`Performed YouTube search for: ${query}`);
  return {
    extensionResponse: `ignore`,
    queryLLM: false
  };
}
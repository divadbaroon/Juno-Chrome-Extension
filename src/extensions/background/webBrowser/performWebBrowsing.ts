import { ExtensionResult } from '../../../types'

/*
Webbrowser Extension: Open's a given webpage within the user's browser
*/
export async function openWebpage(url: string): Promise<ExtensionResult> {
  const searchUrl = `https://www.${url}.com/`;
  await chrome.tabs.create({ url: searchUrl });
  console.log(`Opened webpage: ${url}`);
  return {
    extensionResponse: `ignore`,
    queryLLM: false
  };
}

/*
Webbrowser Extension: Perform's a given Google query
*/
export async function performGoogleSearch(query: string): Promise<ExtensionResult> {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  await chrome.tabs.create({ url: searchUrl });
  console.log(`Performed Google search for: ${query}`);
  return {
    extensionResponse: `ignore`,
    queryLLM: false
  };
}


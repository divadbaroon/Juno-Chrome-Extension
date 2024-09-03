import { ExtensionResult } from '../../../types'

// Function to open a specific webpage
export async function openWebpage(url: string): Promise<ExtensionResult> {
  const searchUrl = `https://www.${url}.com/`;
  await chrome.tabs.create({ url: searchUrl });
  console.log(`Opened webpage: ${url}`);
  return {
    extensionResponse: `ignore`,
    queryLLM: false
  };
}

// Function to perform a Google search
export async function performGoogleSearch(query: string): Promise<ExtensionResult> {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  await chrome.tabs.create({ url: searchUrl });
  console.log(`Performed Google search for: ${query}`);
  return {
    extensionResponse: `ignore`,
    queryLLM: false
  };
}


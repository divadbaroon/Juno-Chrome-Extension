import { ExtensionResult } from '../../../types';

export async function handleShowUI(): Promise<ExtensionResult> {
  try {
    await injectUIComponent();
    return { extensionResponse: "ignore", queryLLM: false };
  } catch (error) {
    return { extensionResponse: "Error showing UI", queryLLM: true };
  }
}

async function injectUIComponent() {
  const container = document.createElement('div');
  container.id = 'ai-chat-interface-container';
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    width: 400px;
    height: 400px; 
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden; 
  `;
  document.body.appendChild(container);

  // Load external script
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('ui.js');
  script.type = 'module';
  document.body.appendChild(script);

}

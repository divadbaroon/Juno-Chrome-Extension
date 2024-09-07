import { ExtensionResult } from '../../../types';
import { containerStyle, chatInterfaceStyles } from './chatInterfaceStyles';

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
  
  container.style.cssText = containerStyle;

  const styleTag = document.createElement('style');
  styleTag.textContent = chatInterfaceStyles;
  document.head.appendChild(styleTag);

  document.body.appendChild(container);

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('ui.js');
  script.type = 'module';
  document.body.appendChild(script);
}
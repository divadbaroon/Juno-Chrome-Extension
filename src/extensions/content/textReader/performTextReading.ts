// contentScript.ts

import { ExtensionResult } from "../../../types";

// Function to get the currently highlighted text
export async function getSelectedText(): Promise<ExtensionResult> {
  const selection = window.getSelection();
  const selectedText = selection ? selection.toString() : "";

  if (selectedText) {
    return {
      extensionResponse: selectedText,
      queryLLM: true,
    };
  } else {
    console.log("No text selected.");
    return {
      extensionResponse: "No text selected.",
      queryLLM: true,
    };
  }
}
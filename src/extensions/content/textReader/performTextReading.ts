// contentScript.ts

import { ExtensionResult } from "../../../types";

/*
TextReader Extension: Get's the user's currently highlighted text and automatically includes it as context to the LLM
*/
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
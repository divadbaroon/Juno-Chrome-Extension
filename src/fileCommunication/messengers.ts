import { Prompt, GenerateResponseResult, IntentResult, BackgroundResponse, Secrets, Profile, ExtensionResult } from '../types';

/**
 * Requests a response from the Language Learning Model (LLM).
 */
export async function requestLLMResponse(usersSpeech: string, prompt: Prompt, openAIKey: string, additionalInformation?: string, fileURL?: string): Promise<GenerateResponseResult> {
    try {
        console.log("Sending message to generate response:", { usersSpeech, prompt, openAIKey, additionalInformation });
        const response = await chrome.runtime.sendMessage({
            action: "generateResponse",
            usersSpeech,
            prompt,
            apiKey: openAIKey,
            additionalInformation,
            fileURL
        });
        console.log("Received response from background script:", response);
        return response as GenerateResponseResult;
    } catch (error) {
        console.error("Error in requestLLMResponse:", error);
        return { success: false, error: "Error generating LLM response" };
    }
}

/**
 * Requests intent recognition for given text.
 */
export async function requestIntentRecognition(text: string, secrets: Secrets): Promise<IntentResult> {
    try {
        const response: BackgroundResponse = await chrome.runtime.sendMessage({
            action: "recognizeIntent",
            text,
            secrets
        });
        console.log("Received response from background script:", response);
        if (!response.success || !response.result) {
            throw new Error(response.error || "Invalid response");
        }
        return response.result as IntentResult;
    } catch (error) {
        console.error("Error in requestIntentRecognition:", error);
        throw new Error("Error recognizing intent");
    }
}

/**
 * Requests initial data for the extension.
 */
export async function requestInitialData(): Promise<{shortcut: string, secrets: Secrets; profile: Profile; voice: any, prompt: any} | null> {
    try {
        const response = await chrome.runtime.sendMessage({ action: "initializeData" });
        if (!response.success) {
            throw new Error(response.error || "Initialization failed");
        }
        return response.data;
    } catch (error) {
        console.error("Error in requestInitialData:", error);
        return null;
    }
}

/**
 * Handles opening a website based on the recognized intent.
 */
export async function handleWebsiteOpen(intentResult: IntentResult): Promise<ExtensionResult> {
    try {
        if (intentResult.topEntity && intentResult.topEntity.category === 'website') {
            console.log("Opening website:", intentResult.topEntity.text);
            return await chrome.runtime.sendMessage({ action: "open_webpage", url: intentResult.topEntity.text });
        } else {
            throw new Error('No valid website entity found');
        }
    } catch (error) {
        console.error("Error in handleWebsiteOpen:", error);
        return { extensionResponse: "Error opening website", queryLLM: true };
    }
}

/**
 * Handles performing a Google search based on the recognized intent.
 */
export async function handleGoogleSearch(intentResult: IntentResult): Promise<ExtensionResult> {
    try {
        if (intentResult.topEntity && intentResult.topEntity.category === 'google_query') {
            console.log("Performing Google search for:", intentResult.topEntity.text);
            return await chrome.runtime.sendMessage({ action: "perform_google_search", query: intentResult.topEntity.text });
        } else {
            throw new Error('No valid search query entity found');
        }
    } catch (error) {
        console.error("Error in handleGoogleSearch:", error);
        return { extensionResponse: "Error performing Google search", queryLLM: true };
    }
}

/**
 * Handles performing a YouTube search based on the recognized intent.
 */
export async function handleYouTubeSearch(intentResult: IntentResult): Promise<ExtensionResult> {
    try {
        if (intentResult.topEntity && intentResult.topEntity.category === 'youtube_query') {
            console.log("Performing YouTube search for:", intentResult.topEntity.text);
            return await chrome.runtime.sendMessage({ action: "perform_youtube_search", query: intentResult.topEntity.text });
        } else {
            throw new Error('No valid search query entity found');
        }
    } catch (error) {
        console.error("Error in handleYouTubeSearch:", error);
        return { extensionResponse: "Error performing YouTube search", queryLLM: true };
    }
}

/**
 * Handles capturing a screenshot.
 */
export async function handleScreenshotCapture(_intentResult: IntentResult): Promise<ExtensionResult> {
    try {
        console.log("Capturing screenshot");
        return await chrome.runtime.sendMessage({ action: "capture_screenshot" });
    } catch (error) {
        console.error("Error in handleScreenshotCapture:", error);
        return { extensionResponse: "Error capturing screenshot", queryLLM: true };
    }
}

// Used for speech recognition
// @ts-ignore
import { GoogleSpeechRecognition } from 'google-cloud-speech-webaudio';

// Used to handle call to extensions, depending on the user's intent
import { handleExtensionCalls } from '../functions/callExtension/handleExtensionCalls';

// Used for perform text-to-speech and streaming the audio to the user's webbrowser
import { streamAudio } from '../functions/textToSpeech/performTextToSpeech';

import { requestInitialData, // Used to initialize necessary user data such as designated shortcut, secrets, voiceID, etc
    requestIntentRecognition, // Used to perform intent recognition on user's speech
    requestLLMResponse, // Queries the user's selected large langauge model
   } from '../fileCommunication/messengers' // Used to send message to background script to execute these functions

import { Secrets, Prompt, ExtensionResult  } from '../types';

/**
 * Responsible for conducting the key functionalities of Juno including:
 * Speech recognition, intent recognition, extension handling, and finally text-to-speech
 */
export class Engine {
    private speechRecognition: GoogleSpeechRecognition | null = null;
    private secrets!: Secrets;
    private voiceId!: string;
    private prompt!: Prompt;
    private sustainedAdditionalInformation: string = '';

    /**
     * Retrieves the initial data which includes, the user's currently selected profile and the data included in said 
     * profile (such as voiceId and prompt), and secret data including api keys and endpoints
     */
    async initialize() {
        // Fetch the profile data of the user's currently selected profile
        const initialData = await requestInitialData();

        if (initialData) {
            // Initialize all fields using data from profile
            this.speechRecognition = new GoogleSpeechRecognition(initialData.secrets.GoogleSpeechAPI, initialData.secrets.GoogleSpeechEndpoint);
            this.secrets = initialData.secrets;
            this.voiceId = initialData.voice.voiceId;
            this.prompt = initialData.prompt;
        }
    }

     /**
     * Begins listening for user-input via their microphone
     */
    async listen() {
        try {
            console.log('Listening...')
            await this.speechRecognition.startListening();
            } catch (error) {
            console.error('Error starting speech recognition:', error);
            this.speechRecognition = null;
            }
    }

     /**
     * Produces a response/ action to the user's input using the following workflow:
     * 
     * Retrieve user's input -> perform intent recognition on user's speech -> call extension based on user's intent (if applicable)
     * -> Query LLM using context (user's speech and resposne from extension (if applicable)) -> finally perform TTS on response from LLM
     */
    async produceResponse() {
        try {
            const userInput = await this.getUserSpeech();
            const intentResult = await this.recognizeIntent(userInput);
            const extensionResult = await this.handleExtension(intentResult);
            const response = await this.generateResponse(userInput, extensionResult);
            await this.performTextToSpeech(response);
            return response;
        } catch (error) {
            console.error('Error in produceResponse:', error);
        } finally {
            this.speechRecognition = null;
        }
    }

    /**
     * Takes audio recorded from user microphone and transcribes it using Google Speech-to-Text     
    */
    private async getUserSpeech(): Promise<string> {
        const result = await this.speechRecognition.stopListening();
        const userInput = result.results[0].alternatives[0].transcript;
        console.log('User speech:', userInput);
        return userInput;
    }

    /**
     * Peform's intent recognition on user's speech using Azure CLU   
    */
    private async recognizeIntent(userInput: string) {
        try {
            const intentResult = await requestIntentRecognition(userInput, this.secrets);
            console.log('Intent recognized:', intentResult);
            return intentResult
        } catch (intentError) {
            console.error('Error during intent recognition:', intentError);
        }
    }

    /**
     * Handle appropriate extension calls based on the intent detected from the user's input
    */
    private async handleExtension(intentResult: any): Promise<ExtensionResult | null> {
        if (intentResult && intentResult.confidence > 0.80) {
            return await handleExtensionCalls(intentResult);
        }
        return null;
    }

    /**
     * Query LLM using context (user's speech and resposne from extension (if applicable))
     * 
     * TODO: Refactor this method to make it more intuitive and readable
    */
    private async generateResponse(userInput: string, extensionResult: ExtensionResult | null): Promise<string> {
        let response = '';
        if (extensionResult && extensionResult.extensionResponse !== 'ignore') {
            if (extensionResult.queryLLM) {
                if (extensionResult.extensionResponse) {
                    this.sustainedAdditionalInformation = extensionResult.extensionResponse;
                }
                const llmResponse = await requestLLMResponse(
                    userInput, 
                    this.prompt, 
                    this.secrets.OpenAI, 
                    this.sustainedAdditionalInformation,
                    extensionResult.fileURL
                );
                response = llmResponse.response || '';
            } else {
                response = extensionResult.extensionResponse;
            }
        }
        if (!response && extensionResult?.extensionResponse !== 'ignore') {
            const llmResponse = await requestLLMResponse(userInput, this.prompt, this.secrets.OpenAI, this.sustainedAdditionalInformation);
            response = llmResponse.response || '';
        }
        return response;
    }

    /**
     * Perform's Text-to-Speech using Elevenlabs
    */
    private async performTextToSpeech(response: string) {
        if (response) {
            console.log("LLM's response:", response);
            await streamAudio(response, this.voiceId, this.secrets.Elevenlabs);
        } else {
            console.error('No response generated');
        }
    }
}
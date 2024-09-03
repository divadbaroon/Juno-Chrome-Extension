import { Secrets, Profile } from '../types';
import { getFromChromeStorage } from '../popup/components/secrets/secretHandler';
import { getCurrentProfile } from '../popup/components/home/profileHandler/profileManager';
import { fetchVoiceById, fetchPromptById } from '../popup/components/home/cardDisplay/getCardDetails';

/* 
Initializes the user's data including their selected shortcut (for interaction with Juno), 
secrets (API keys and end points), profile (user's currently selected profile), 
voiceID (for text-to-speech), and prompt (prompt used to query LLM)
*/
export async function initializeData(): Promise<{shortcut: string, secrets: Secrets; profile: Profile; voice: any, prompt: any}> {

    // get the users currently selected shortcut (CTRL + SHIFT + S) by defualt
    const shortcut = await getFromChromeStorage<string>("Shortcut") || "CTRL + SHIFT + S"
  
    // get nessary api keys and end point
    const secrets: Secrets = {
      OpenAI: await getFromChromeStorage<string>("OpenAI") || "",
      Elevenlabs: await getFromChromeStorage<string>("Elevenlabs") || "",
      GoogleSpeechAPI: await getFromChromeStorage<string>("GoogleSpeechAPI") || "",
      GoogleSpeechEndpoint: await getFromChromeStorage<string>("GoogleSpeechEndpoint") || "",
      AzureCLUKey: await getFromChromeStorage<string>("AzureCLUKey") || "",
      AzureCLUEndpoint: await getFromChromeStorage<string>("AzureCLUEndpoint") || "",
      AzureCLUProjectName: await getFromChromeStorage<string>("AzureCLUProjectName") || "",
      AzureCLUDeploymentName: await getFromChromeStorage<string>("AzureCLUDeploymentName") || "",
    };
  
    // get the users currently selected profile
    const profile = await getCurrentProfile();
    if (!profile) {
      throw new Error("No profile selected");
    }
  
    // get voice using users currently selected voiceID from their profile
    let voice = null;
    if (profile.voice) { 
      voice = await fetchVoiceById(profile.voice);
    }
  
    // get prompt using users currently selected promptID from their profile
    let prompt = null;
    if (profile.prompt) { 
      prompt = await fetchPromptById(profile.prompt);
    }
  
    return { shortcut, secrets, profile, voice, prompt };
  }
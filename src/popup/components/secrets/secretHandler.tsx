const API_ENDPOINT = 'https://www.junoai.io/api/webhooks/keys';

async function fetchKeysFromAPI() {
  try {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) {
      throw new Error('Failed to fetch keys from API');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching keys from API:', error);
    throw error;
  }
}

// Gets a value from Chrome storage or API if not found
export async function getFromChromeStorage<T>(key: string): Promise<T | string | null> {
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, async (result) => {
            if (result[key] !== undefined) {
                resolve(result[key]);
            } else if (
                      key === 'GoogleSpeechAPI' || key === 'GoogleSpeechEndpoint' || key === 'ClerkPublishableKey' || 
                      key === 'AzureCLUKey' || key === 'AzureCLUEndpoint' || key === 'AzureCLUProjectName' || key === 'AzureCLUDeploymentName'
                      ) {
                try {
                    const apiKeys = await fetchKeysFromAPI();
                    const value = apiKeys[key];
                    if (value) {
                        await storeInChromeStorage(key, value);
                        resolve(value);
                    } else {
                        console.error(`${key} not found in API response`);
                        resolve(null);
                    }
                } catch (error) {
                    console.error(`Error fetching ${key} from API:`, error);
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    });
}

// Stores a value in Chrome storage
export async function storeInChromeStorage<T>(key: string, value: T): Promise<void> {
  console.log("key" + key, value)
    return new Promise((resolve) => {
        chrome.storage.sync.set({ [key]: value }, () => {
            resolve();
        });
    });
}

// Sends a query to openAI using provided api key
export const validateOpenAIKey = async (key: string) => {
    try {
      const response = await fetch('https://api.openai.com/v1/engines', {
        headers: { 'Authorization': `Bearer ${key}` }
      });
      return response.ok;
    } catch (error) {
      console.error('Error validating OpenAI key:', error);
      return false;
    }
  };

// Sends a query to elevenlabs using provided api key
export const validateElevenLabsKey = async (key: string) => {
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: { 'xi-api-key': key }
      });
      return response.ok;
    } catch (error) {
      console.error('Error validating ElevenLabs key:', error);
      return false;
    }
  };
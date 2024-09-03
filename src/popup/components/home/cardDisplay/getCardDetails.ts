import { Extension, Voice, LLM, Prompt } from "../../../../types"

export async function fetchExtensionById(extensionId: string): Promise<Extension | null> {
    try {
        const extensionResponse = await fetch(`https://www.junoai.io/api/webhooks/extensions?extensionId=${extensionId}`);

        if (!extensionResponse.ok) {
          throw new Error('Failed to fetch user data 1');
        }

        const extensionData: Extension = await extensionResponse.json();

        return extensionData
    } catch (error) {
      console.error('Error fetching extension data:', error);
      return null;
    }
  }

export async function fetchVoiceById(voiceId: string): Promise<Voice | null> {
    try {
        const voiceResponse = await fetch(`https://www.junoai.io/api/webhooks/voices?voiceId=${voiceId}`);

        if (!voiceResponse.ok) {
            throw new Error('Failed to fetch user data 1');
        }

        const voiceData: Voice = await voiceResponse.json();

        return voiceData
    } catch (error) {
        console.error('Error fetching voice data:', error);
        return null;
    }
}

export async function fetchLLMById(llmId: string): Promise<LLM | null> {
    try {
        const llmResponse = await fetch(`https://www.junoai.io/api/webhooks/llms?llmId=${llmId}`);

        if (!llmResponse.ok) {
            throw new Error('Failed to fetch user data 1');
        }

        const llmData: LLM = await llmResponse.json();

        return llmData
    } catch (error) {
        console.error('Error fetching llm data:', error);
        return null;
    }
}

export async function fetchPromptById(promptId: string): Promise<Prompt | null> {
    try {
        const promptResponse = await fetch(`https://www.junoai.io/api/webhooks/prompts?promptId=${promptId}`);

        if (!promptResponse.ok) {
            throw new Error('Failed to fetch user data 1');
        }

        const promptData: Prompt = await promptResponse.json();

        return promptData
    } catch (error) {
        console.error('Error fetching prompt data:', error);
        return null;
    }
}




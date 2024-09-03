import { OpenAIResponse } from '../../types';

export async function generateResponse(usersSpeech: string, prompt: any, apiKey: string, additionalInformation?: string, fileURL?: string): Promise<string> {
  try {
    let userMessage: any = {
      role: 'user',
      content: [
        { type: 'text', text: usersSpeech }
      ]
    };

    console.log(fileURL)

    if (fileURL) {
      userMessage.content.push({
        type: "image_url",
        image_url: {
          url: fileURL  
        }
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",  
        messages: [
          {
            role: 'system',
            content: `
              Your core persona that you will embody: ${prompt.context}
              Your context & background: ${prompt.background}
              Your personality: ${prompt.personality}
              Your interaction guidelines: ${prompt.interactionGuidelines}
              Respond to the user's query while strictly following the provided persona, background information, personality traits, and interaction guidelines.

              ${additionalInformation ? `The user executed a command and the following information is provided as additional information: ${additionalInformation}` : ''}
            `
          },
          userMessage
        ],
        max_tokens: 100
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const llmData: OpenAIResponse = await response.json();
    console.log("OpenAI API Response:", JSON.stringify(llmData, null, 2));

    const content = llmData.choices[0].message.content;
    return content;

  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
}

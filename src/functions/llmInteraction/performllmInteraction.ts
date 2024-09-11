export async function generateResponse(usersSpeech: string, prompt: any, apiKey: string, additionalInformation?: string, fileURL?: string): Promise<string> {
  try {
    let userMessage: any = {
      role: 'user',
      content: [
        { type: 'text', text: usersSpeech }
      ]
    };

    if (fileURL) {
      userMessage.content.push({
        type: "image_url",
        image_url: { url: fileURL }
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
        max_tokens: 1000,
        stream: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    let buffer = '';
    let sentenceBuffer = '';
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunk = decoder.decode(value);
      buffer += chunk;

      while (true) {
        const match = buffer.match(/^data: (.+)\n\n/);
        if (!match) break;

        const [fullMatch, jsonData] = match;
        buffer = buffer.slice(fullMatch.length);

        if (jsonData === '[DONE]') {
          if (sentenceBuffer.trim()) {
            const finalSentence = sentenceBuffer.trim();
            console.log('Final sentence:', finalSentence);
            fullResponse += finalSentence;
          }
          return fullResponse;
        }

        try {
          const parsedData = JSON.parse(jsonData);
          const content = parsedData.choices[0].delta.content || '';
          sentenceBuffer += content;

          const sentences = sentenceBuffer.match(/[^.!?]+[.!?]+/g) || [];
          for (const sentence of sentences) {
            const trimmedSentence = sentence.trim();
            console.log('Completed sentence:', trimmedSentence);
            fullResponse += trimmedSentence + ' ';
            sentenceBuffer = sentenceBuffer.slice(sentence.length);
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
    }

    if (sentenceBuffer.trim()) {
      const finalSentence = sentenceBuffer.trim();
      console.log('Final sentence:', finalSentence);
      fullResponse += finalSentence;
    }

    return fullResponse.trim();

  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
}
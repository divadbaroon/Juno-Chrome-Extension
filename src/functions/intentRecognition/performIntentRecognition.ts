import { ConversationAnalysisClient, ConversationalTask } from "@azure/ai-language-conversations";
import { AzureKeyCredential } from "@azure/core-auth";

interface Entity {
  text: string;
  category: string;
  confidenceScore: number;
}

interface IntentResult {
  intent: string;
  confidence: number;
  topEntity?: Entity;
}

export async function recognizeIntent(text: string): Promise<IntentResult> {
  const cluEndpoint = "https://eastus.api.cognitive.microsoft.com/";
  const cluKey = "5f6de410d51045f2bad26341fac632ea";
  const projectName = "Juno";
  const deploymentName = "Juno2";

  const client = new ConversationAnalysisClient(
    cluEndpoint,
    new AzureKeyCredential(cluKey)
  );

  const body: ConversationalTask = {
    kind: "Conversation",
    analysisInput: {
      conversationItem: {
        id: "1",
        participantId: "1",
        text: text,
      },
    },
    parameters: {
      projectName: projectName,
      deploymentName: deploymentName,
      stringIndexType: "TextElement_V8"
    },
  };

  try {
    const { result } = await client.analyzeConversation(body);

    if (result.prediction.projectKind === "Conversation" && result.prediction.intents.length > 0) {
      const topIntent = result.prediction.intents[0];
      let topEntity = result.prediction.entities?.[0];

      const intentResult: IntentResult = {
        intent: topIntent.category,
        confidence: topIntent.confidence,
      };

      if (topEntity) {
        intentResult.topEntity = {
          text: topEntity.text,
          category: topEntity.category,
          confidenceScore: topEntity.confidence
        };
      }

      return intentResult;
    } else {
      throw new Error("No intent recognized");
    }
  } catch (error) {
    console.error("Error recognizing intent:", error);
    throw error;
  }
}

// Message listener
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "recognizeIntent" && message.text) {
    recognizeIntent(message.text)
      .then(result => {
        sendResponse({ success: true, result: result });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true;  
  }
});
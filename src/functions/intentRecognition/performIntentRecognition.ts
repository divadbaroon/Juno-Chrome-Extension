import { ConversationAnalysisClient, ConversationalTask } from "@azure/ai-language-conversations";
import { AzureKeyCredential } from "@azure/core-auth";

import { IntentResult, Secrets } from '../../types'

/*
Takes the user's input and performs intent recognition on it using Azure CLU
*/
export async function recognizeIntent(text: string, secrets: Secrets): Promise<IntentResult> {

  // Authentication
  const client = new ConversationAnalysisClient(
    secrets.AzureCLUEndpoint,
    new AzureKeyCredential(secrets.AzureCLUKey)
  );

  // Prepare body to be sent to Azure CLU
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
      projectName: secrets.AzureCLUProjectName,
      deploymentName: "Juno5",
      stringIndexType: "TextElement_V8"
    },
  };

  try {
    // Recieve result from Azure CLU
    const { result } = await client.analyzeConversation(body);

    // If a result was recieved, extract the results
    if (result.prediction.projectKind === "Conversation" && result.prediction.intents.length > 0) {
      // Extract top intent information
      const topIntent = result.prediction.intents[0];
      // Extract top entity if it exists
      let topEntity = result.prediction.entities?.[0];

      // Extract top intent and confidence level
      const intentResult: IntentResult = {
        intent: topIntent.category,
        confidence: topIntent.confidence,
      };

      // If top entity was also recieved, add it to the intentResult object
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

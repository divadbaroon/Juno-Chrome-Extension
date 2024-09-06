export interface Profile {
  _id: string;
  name: string;
  description: string;
  llm: string;
  voice: string;
  prompt: string;
  extensions: string[];
  sharePreference: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  creator: string;
  genre: string;
  maxTokens?: number; 
  objectURL?: string;
  link?: string
}

export interface UserDetails {
  clerkId: string;
  userCollection: {
    profiles: string[];
    llms: string[];
    voices: string[];
    extensions: string[];
    prompts: string[];
  };
}

export interface ProfilePopoverProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  profiles: Profile[];
  handleProfileSelect: (profileName: string) => void;
}

  
export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface Secrets {
  OpenAI: string;
  Elevenlabs: string;
  GoogleSpeechAPI: string;
  GoogleSpeechEndpoint: string;
  ClerkPublishableKey?: string;
  AzureCLUKey: string;
  AzureCLUEndpoint: string;
  AzureCLUProjectName: string;
  AzureCLUDeploymentName: string;
}

export interface GenerateResponseResult {
  success: boolean;
  response?: string;
  error?: string;
  result?: string
}

export interface BackgroundResponse {
  success: boolean;
  result?: IntentResult;
  error?: string;
}


export interface InteractionMessage {
  action: 'BeginInteraction' | 'StopInteraction';
  profile?: Profile;
}

export interface InteractionResponse {
  status: 'started' | 'stopped' | 'error';
  message?: string;
}

export interface Extension {
  _id: string;
  name: string;
  creator: string;
  description: string;
  sharePreference: string; 
  exampleUsage: string;
  createdAt: string; 
  updatedAt: string; 
}

export interface Voice {
  _id: string;
  name: string;
  creator: string;
  description: string;
  sharePreference: string; 
  voiceId: string;
  objectURL: string;
  createdAt: string; 
  updatedAt: string; 
}

export interface LLM {
  _id: string;
  creator: string;
  description: string;
  sharePreference: string; 
  name: string;
  link: string;
  createdAt: string; 
  updatedAt: string; 
}

export interface Prompt {
  _id: string;
  name: string;
  creator: string;
  description: string;
  sharePreference: string; 
  personality: string;
  context: string;
  interactionGuidelines: string;
  background: string;
  temperature: number;
  createdAt: string; 
  updatedAt: string; 
}

export interface Data {
  voice: Voice,
  secrets: Secrets,
  profile: Profile,
  prompt: Prompt
}

export interface Entity {
  category: string;
  text: string;
  offset?: number;
  length?: number;
  confidenceScore: number;
}

export interface IntentResult {
  intent: string;
  confidence: number;
  topEntity?: Entity;  
}

export interface ExtensionResult {
  extensionResponse: string;
  queryLLM: boolean;
  fileURL?: string
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CarouselProps {
  profiles: Profile[];
  selectedProfile: Profile | null;
  userDetails: UserDetails;
  handleProfileSelection: (profile: Profile) => void;
  isCardInCollection: (id: string) => boolean;
  onReload: () => void;
}

export interface DisplayCardProps {
  clerkId: string; 
  contextType: string;
  type: string;
  title: string;
  creator: string;
  blobURL?: string;
  link?: string;
  description: string;
  photo?: string;
  isSelected: boolean;
  onSelect: () => void;
  userCollection: {
    profiles: string[];
    llms: string[];
    voices: string[];
    extensions: string[];
  };
  isInCollection: boolean;
  additionalInfo?: string;
  onReload: () => void;
  models: string[];
  allItems: any;
}

export interface User {
  _id: string;
  clerkId: string;
  userCollection: {
    profiles: string[];
  };
}

export enum Page {
  HOME = 'HOME',
  ASSISTANT = 'ASSISTANT',
  TOOLS = 'TOOLS',
  SERVICES = 'SERVICES',
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  };
}

export interface Project {
  title: string;
  badge: 'Standard' | 'Advanced' | 'Premium' | 'Audit';
  description: string;
  fullDescription: string;
  features: string[];
  price: string;
}
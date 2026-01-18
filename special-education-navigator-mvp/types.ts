export enum Sender {
  USER = 'user',
  AI = 'model'
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
  isStreaming?: boolean;
  groundingSources?: GroundingSource[];
}

export interface ChatSessionState {
  isActive: boolean;
  userState: string; // The US State (e.g., "California")
}
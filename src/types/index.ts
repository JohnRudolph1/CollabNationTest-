export type Visibility = 'public' | 'private';
export type FeedSort = 'hot' | 'new' | 'top' | 'rising';

export interface UserProfile {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  interests: string[];
  availability?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface Project {
  id: string;
  ownerId: string;
  ownerUsername: string;
  ownerAvatar?: string;
  title: string;
  body: string;
  skills: string[];
  visibility: Visibility;
  createdAt: number;
  collaboratorIds?: string[];
}

export interface CollaborationRequest {
  id: string;
  projectId: string;
  projectOwnerId: string;
  requesterId: string;
  requesterUsername: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  attachmentUrl?: string;
  createdAt: number;
}

export interface ConversationMeta {
  id: string;
  participantIds: string[];
  lastMessage?: string;
  lastMessageAt?: number;
}

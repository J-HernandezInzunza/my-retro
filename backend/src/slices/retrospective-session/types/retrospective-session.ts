import { RetroSession, RetroSessionStatus, RetroFormat } from '../../../generated/prisma';

// API Request/Response Types
export interface CreateRetroSessionRequest {
  name: string;
  teamId: string;
  formatId: string;
}

export interface CreateRetroSessionResponse {
  id: string;
  name: string;
  status: RetroSessionStatus;
  teamId: string;
  formatId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RetroSessionListResponse {
  id: string;
  name: string;
  status: RetroSessionStatus;
  createdAt: Date;
  updatedAt: Date;
  format: {
    id: string;
    name: string;
    slug: string;
  };
  itemCount: number;
  participantCount: number;
}

export interface RetroSessionDetailResponse extends CreateRetroSessionResponse {
  format: RetroFormat;
  itemCount: number;
  participantCount: number;
}

export interface UpdateRetroSessionRequest {
  name?: string;
  status?: RetroSessionStatus;
}

// WebSocket Event Types
export const RETRO_SESSION_EVENTS = {
  CREATED: 'retro-session:created',
  UPDATED: 'retro-session:updated',
  STATUS_CHANGED: 'retro-session:status-changed',
  PARTICIPANT_JOINED: 'retro-session:participant-joined',
  PARTICIPANT_LEFT: 'retro-session:participant-left',
} as const;

export type RetroSessionEventType = typeof RETRO_SESSION_EVENTS[keyof typeof RETRO_SESSION_EVENTS];

export interface RetroSessionEvent {
  type: RetroSessionEventType;
  sessionId: string;
  teamId: string;
  data: any;
}

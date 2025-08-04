import { UserSession } from '../../../generated/prisma';

export interface UserSessionInitializeRequest {
  displayName?: string;
}

export interface UserSessionUpdateRequest {
  displayName?: string;
  lastActive?: Date;
}

export interface UserSessionResponse {
  session: UserSession;
}

type ValueOf<T> = T[keyof T];

// Define socket event names matching the backend
export const SESSION_EVENTS = {
  ONLINE_USERS: 'online:users',
  INITIALIZE: 'session:initialize',
  UPGRADE: 'session:upgrade',
  UPDATE_NAME: 'session:updateName',
  CLEAR: 'session:clear',
  UPDATED: 'session:updated',
  CLEARED: 'session:cleared',
} as const;

export type SESSION_EVENTS = ValueOf<typeof SESSION_EVENTS>;

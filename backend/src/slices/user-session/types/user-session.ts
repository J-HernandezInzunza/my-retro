import { UserSession } from '../../../generated/prisma';

export interface UserSessionInitializeRequest {
  displayName?: string;
}

export interface UserSessionUpdateRequest {
  displayName?: string;
  teamId?: string;
  lastActive?: Date;
}

export interface UserSessionResponse {
  session: UserSession;
}

// Type mappings for socket events
type ValueOf<T> = T[keyof T];
// Define socket event names matching the backend
export const SESSION_EVENTS = {
  ONLINE_USERS: 'online:users',
  INITIALIZE: 'session:initialize',
  UPDATE_NAME: 'session:updateName',
  JOIN_TEAM: 'session:joinTeam',
  CLEAR: 'session:clear',
  UPDATED: 'session:updated',
  CLEARED: 'session:cleared',
} as const;

export type SESSION_EVENTS = ValueOf<typeof SESSION_EVENTS>;

export interface SocketUserEventMap {
  [SESSION_EVENTS.INITIALIZE]: {
    request: UserSessionInitializeRequest;
    response: UserSessionResponse & { token: string } | { error: string };
  };
  [SESSION_EVENTS.UPDATE_NAME]: {
    request: UserSessionUpdateRequest;
    response: UserSessionResponse | { error: string };
  };
  [SESSION_EVENTS.JOIN_TEAM]: {
    request: UserSessionUpdateRequest;
    response: UserSessionResponse | { error: string };
  };
  [SESSION_EVENTS.CLEAR]: {
    request: void;
    response: { success: boolean } | { error: string };
  };
  [SESSION_EVENTS.UPDATED]: {
    request: never; // Server to client event, no request
    response: UserSessionResponse;
  };
  [SESSION_EVENTS.ONLINE_USERS]: {
    request: never; // Server to client event, no request
    response: { count: number };
  };
}

/**
 * Helper type to extract the request type for a given event
 */
export type EventRequestType<E extends keyof SocketUserEventMap> = SocketUserEventMap[E]['request'];

/**
 * Helper type to extract the response type for a given event
 */
export type EventResponseType<E extends keyof SocketUserEventMap> = SocketUserEventMap[E]['response'];

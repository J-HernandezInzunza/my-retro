import {
  SESSION_EVENTS,
  type UserSessionInitializeRequest,
  type UserSessionUpdateRequest,
  type UserSessionResponse,
} from '../../backend/src/slices/user-session/types/user-session';
import {
  USER_MANAGEMENT_EVENTS,
  type GetUserRequest,
  type GetUserResponse,
  type UserSessionUpgradeRequest,
  type UserSessionUpgradeResponse,
} from '../../backend/src/slices/user-management/types/user-management';
import {
  TEAM_MANAGEMENT_EVENTS,
  type TeamJoinRequest,
  type TeamDetailsResponse,
} from '../../backend/src/slices/team-management/types/team-management';

export interface SocketEventMap {
  [SESSION_EVENTS.INITIALIZE]: {
    request: UserSessionInitializeRequest;
    response: UserSessionResponse & { token: string } | { error: string };
  };
  [SESSION_EVENTS.UPDATE_NAME]: {
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
  [USER_MANAGEMENT_EVENTS.UPGRADE]: {
    request: UserSessionUpgradeRequest;
    response: UserSessionUpgradeResponse | { error: string };
  };
  [USER_MANAGEMENT_EVENTS.GET_USER]: {
    request: GetUserRequest;
    response: GetUserResponse | { error: string };
  };
  [TEAM_MANAGEMENT_EVENTS.JOIN_TEAM]: {
    request: TeamJoinRequest;
    response: TeamDetailsResponse | { error: string };
  };
}

/**
 * Helper type to extract the request type for a given event
 */
export type EventRequestType<E extends keyof SocketEventMap> = SocketEventMap[E]['request'];

/**
 * Helper type to extract the response type for a given event
 */
export type EventResponseType<E extends keyof SocketEventMap> = SocketEventMap[E]['response'];
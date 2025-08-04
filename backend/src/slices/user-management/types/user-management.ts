import { UserRole, User } from "../../../generated/prisma";

export interface UserSessionUpgradeRequest {
  displayName?: string;
  email: string;
  role?: UserRole;
}

export interface UserSessionUpgradeResponse {
  user: User;
}

export interface GetUserRequest {
  userId: string;
}

export interface GetUserResponse {
  user: User | null;
}

type ValueOf<T> = T[keyof T];

// Define socket event names matching the backend
export const USER_MANAGEMENT_EVENTS = {
  UPGRADE: 'user:upgrade',
  UPDATED: 'user:updated',
  GET_USER: 'user:getUser',
  JOIN_TEAM: 'user:joinTeam',
} as const;

export type USER_MANAGEMENT_EVENTS = ValueOf<typeof USER_MANAGEMENT_EVENTS>;

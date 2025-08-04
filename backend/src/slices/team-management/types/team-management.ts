// Import generated Prisma types
import { Team, User, TeamMember } from '../../../generated/prisma';

// Simple types for basic team operations
export interface TeamCreateRequest {
  userId: string;
  name: string;
}

export interface TeamJoinRequest {
  userId: string;
  inviteCode: string;
}

// Service return types using generated Prisma types
export type TeamCreateResponse = Pick<Team, 'id' | 'name' | 'inviteCode' | 'createdAt'>;

export type UserTeamMembership = {
  team: Pick<Team, 'id' | 'name' | 'inviteCode' | 'createdAt' | 'updatedAt'>;
  role: TeamMember['role'];
  joinedAt: TeamMember['joinedAt'];
};

// Extended types for team details information
export type TeamDetailsResponse = {
  team: Pick<Team, 'id' | 'name' | 'createdAt' | 'updatedAt'>,
  members: TeamMemberResponse[];
};
export type TeamMemberResponse = (Pick<User, 'id' | 'displayName' | 'email'> & Pick<TeamMember, 'role'>);

// Simple error handling
export class TeamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TeamError';
  }
}

type ValueOf<T> = T[keyof T];

// Define socket event names matching the backend
export const TEAM_MANAGEMENT_EVENTS = {
  JOIN_TEAM: 'team:joinTeam',
} as const;

export type TEAM_MANAGEMENT_EVENTS = ValueOf<typeof TEAM_MANAGEMENT_EVENTS>;
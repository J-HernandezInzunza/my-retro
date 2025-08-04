// Import generated Prisma types
import { Team, User, TeamMember } from '../../../generated/prisma';

// Simple types for basic team operations
export interface TeamCreateRequest {
  userId: string;
  name: string;
}

export type TeamCreateResponse = Pick<Team, 'id' | 'name' | 'inviteCode' | 'createdAt'>;

export interface TeamJoinRequest {
  userId: string;
  inviteCode: string;
}

export interface GetUserTeamsRequest {
  userId: string;
}

export type GetUserTeamsResponse = UserTeamMembership[];

// Service return types using generated Prisma types
export type UserTeamMembership = {
  team: Pick<Team, 'id' | 'name'>;
  role: TeamMember['role'];
  joinedAt: TeamMember['joinedAt'];
};

export type TeamDetailsResponse = {
  team: Pick<Team, 'id' | 'name' | 'createdAt' | 'updatedAt'>,
  members: TeamMemberResponse[];
};
export type TeamMemberResponse = (Pick<User, 'id' | 'displayName'> & Pick<TeamMember, 'role' | 'joinedAt'>);

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
  GET_USER_TEAMS: 'team:getUserTeams',
} as const;

export type TEAM_MANAGEMENT_EVENTS = ValueOf<typeof TEAM_MANAGEMENT_EVENTS>;
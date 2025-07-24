// Import generated Prisma types
import { Team, User, TeamMember } from '../../../generated/prisma';
import { TeamMemberRole } from '../../../generated/prisma';

// Simple types for basic team operations
export interface TeamCreateRequest {
  name: string;
}

export interface TeamJoinRequest {
  inviteCode: string;
}

// Service return types using generated Prisma types
export type TeamCreateResult = Pick<Team, 'id' | 'name' | 'inviteCode' | 'createdAt'>;
export type TeamJoinResult = Pick<Team, 'id' | 'name' | 'inviteCode' | 'createdAt'>;
export type UserTeamMembership = {
  team: Pick<Team, 'id' | 'name' | 'inviteCode' | 'createdAt' | 'updatedAt'>;
  role: TeamMember['role'];
  joinedAt: TeamMember['joinedAt'];
};

// Extended types for team details information
export type TeamDetailsResponse = {
  team: Pick<Team, 'id' | 'name' | 'inviteCode' | 'createdAt' | 'updatedAt'>
  & {
    members: TeamMemberResponse[];
  };
};
export type TeamMemberResponse = (Pick<User, 'id' | 'displayName' | 'email'> & Pick<TeamMember, 'role'>);

// Simple error handling
export class TeamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TeamError';
  }
}


const test: TeamMemberResponse = {
  id: '1',
  displayName: 'Test',
  email: 'test@test.com',
  role: TeamMemberRole.MEMBER,
}
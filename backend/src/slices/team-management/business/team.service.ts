import { PrismaClient, TeamMemberRole, TeamMember, UserRole } from '../../../generated/prisma';
import { InviteCodeUtil } from './invite-code.util';
import { 
  TeamDetailsResponse, 
  TeamError, 
  TeamCreateResult, 
  TeamJoinResult, 
  UserTeamMembership 
} from '../types/team-management';

const prisma = new PrismaClient();

export class TeamService {
  /**
   * Create a new team
   * Only ADMIN users can create teams
   */
  async createTeam(userId: string, teamName: string): Promise<TeamCreateResult> {
    // Verify user exists and is an admin
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || (user.role !== UserRole.ADMIN)) {
      throw new TeamError('Only admin users can create teams');
    }

    // Generate unique invite code
    const inviteCode = InviteCodeUtil.generateInviteCode();

    // Create team with creator as facilitator
    const team = await prisma.team.create({
      data: {
        name: teamName,
        inviteCode,
        members: {
          create: {
            userId: userId,
            role: TeamMemberRole.FACILITATOR
          }
        }
      }
    });

    return {
      id: team.id,
      name: team.name,
      inviteCode: team.inviteCode,
      createdAt: team.createdAt
    };
  }

  /**
   * Join a team using invite code
   */
  async joinTeam(userId: string, inviteCode: string): Promise<TeamJoinResult> {
    // Validate invite code format first
    if (!InviteCodeUtil.isValidFormat(inviteCode)) {
      throw new TeamError('Invalid invite code format');
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new TeamError('User not found');
    }

    // Find team by invite code
    const team = await prisma.team.findUnique({
      where: { inviteCode },
      include: {
        members: {
          where: { userId },
          select: { id: true }
        }
      }
    });

    if (!team) {
      throw new TeamError('Invalid invite code');
    }

    // Check if user is already a member
    if (team.members.length > 0) {
      throw new TeamError('User is already a member of this team');
    }

    // Add user as team member
    await prisma.teamMember.create({
      data: {
        userId: userId,
        teamId: team.id,
        role: TeamMemberRole.MEMBER
      }
    });

    return {
      id: team.id,
      name: team.name,
      inviteCode: team.inviteCode,
      createdAt: team.createdAt
    };
  }

  /**
   * Get all teams a user is a member of
   */
  async getUserTeams(userId: string): Promise<UserTeamMembership[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        teamMemberships: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
                inviteCode: true,
                createdAt: true,
                updatedAt: true
              }
            }
          },
          orderBy: {
            joinedAt: 'desc'
          }
        }
      }
    });

    if (!user) {
      throw new TeamError('User not found');
    }

    return user.teamMemberships.map(membership => ({
      team: membership.team,
      role: membership.role,
      joinedAt: membership.joinedAt
    }));
  }

  /**
   * Get detailed information about a specific team
   */
  async getTeamDetails(teamId: string, userId: string): Promise<TeamDetailsResponse> {
    // First verify user is a member of this team
    const membership: TeamMember | null = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: userId,
          teamId: teamId
        }
      }
    });

    if (!membership) {
      throw new TeamError('User is not a member of this team');
    }

    // Get team details with all members
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                email: true
              }
            }
          },
          orderBy: {
            joinedAt: 'asc'
          }
        }
      }
    });

    if (!team) {
      throw new TeamError('Team not found');
    }

    return {
      team: {
        id: team.id,
        name: team.name,
        inviteCode: team.inviteCode,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
        members: team.members.map(member => ({
          id: member.user.id,
          displayName: member.user.displayName,
          email: member.user.email,
          role: member.role,
        })),
      },
    };
  }
}

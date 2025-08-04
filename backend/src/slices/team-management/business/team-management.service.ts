import { prisma } from '../../../app/core/prisma';
import { TeamMemberRole, UserRole, TeamMember } from '../../../generated/prisma';
import { InviteCodeUtil } from './invite-code.util';
import { TeamError, TeamCreateRequest, TeamJoinRequest, UserTeamMembership, TeamDetailsResponse } from '../types/team-management';
import { UserRepository, TeamRepository } from '../../../shared/repositories';

export class TeamManagementService {
  private userRepo: UserRepository;
  private teamRepo: TeamRepository;

  constructor() {
    this.userRepo = new UserRepository(prisma);
    this.teamRepo = new TeamRepository(prisma);
  }
  /**
   * Create a new team
   * Only ADMIN users can create teams
   */
  async createTeam(userId: string, teamName: string): Promise<TeamCreateRequest> {
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
   * Service handles business logic: validation, membership check, formatting
   */
  async joinTeam(data: TeamJoinRequest): Promise<TeamDetailsResponse> {
    // Business validation: invite code format
    if (!InviteCodeUtil.isValidFormat(data.inviteCode)) {
      throw new TeamError('Invalid invite code format');
    }

    // Business validation: verify user exists
    const user = await this.userRepo.findUserById(data.userId);
    if (!user) {
      throw new TeamError('User not found');
    }

    // Business validation: find team by invite code
    const team = await this.teamRepo.findTeamByInviteCode(data.inviteCode);
    if (!team) {
      throw new TeamError('Invalid invite code');
    }

    // Business validation: check if user is already a member
    const isAlreadyMember = await this.teamRepo.isUserTeamMember(data.userId, team.id);
    if (isAlreadyMember) {
      throw new TeamError('User is already a member of this team');
    }

    // Use repository for the data operation
    try {
      const teamWithMembers = await this.teamRepo.addUserToTeam(data.userId, team.id);
      
      // Format response for business layer
      return teamWithMembers;
    } catch (error) {
      // Convert repository errors to business errors
      throw new TeamError(error instanceof Error ? error.message : 'Failed to join team');
    }
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
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
      },
      members: team.members.map(member => ({
          id: member.user.id,
          displayName: member.user.displayName,
          role: member.role,
          joinedAt: member.joinedAt,
        })),
    };
  }
}

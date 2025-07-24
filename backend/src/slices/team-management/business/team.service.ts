import { PrismaClient, TeamMemberRole, UserRole } from '../../../generated/prisma';
import { InviteCodeUtil } from './invite-code.util';
import { TeamError } from '../types/team-management';

const prisma = new PrismaClient();

export class TeamService {
  /**
   * Create a new team
   * Only ADMIN users can create teams
   */
  async createTeam(userId: string, teamName: string) {
    // Verify user exists and is an admin
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || (user.role !== UserRole.ADMIN)) {
      throw new TeamError('Only admin users can create teams');
    }

    // Generate unique invite code
    const inviteCode = InviteCodeUtil.generateInviteCode();

    // Create team with creator as admin member
    const team = await prisma.team.create({
      data: {
        name: teamName,
        inviteCode,
        createdBy: userId,
        updatedBy: userId,
        members: {
          create: {
            userId: userId,
            role: TeamMemberRole.OWNER
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
  async joinTeam(userId: string, inviteCode: string) {
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
}

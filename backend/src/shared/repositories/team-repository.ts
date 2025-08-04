import { PrismaClient, Team, TeamMember, TeamMemberRole, User, UserRole } from '../../generated/prisma';
import { TeamDetailsResponse } from '../../slices/team-management/types/team-management';

export class TeamRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Add a user to a team and return the updated team with all members
   * Repository focuses on data operations only - no business validation
   */
  async addUserToTeam(userId: string, teamId: string): Promise<TeamDetailsResponse> {
    return await this.prisma.$transaction(async (tx) => {
      // Add user as team member
      await tx.teamMember.create({
        data: {
          userId: userId,
          teamId: teamId,
          role: TeamMemberRole.MEMBER
        }
      });

      // Return the team with all members
      const teamWithMembers = await tx.team.findUnique({
        where: { id: teamId },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  displayName: true,
                }
              }
            },
            orderBy: {
              joinedAt: 'asc'
            }
          }
        }
      });

      if (!teamWithMembers) {
        throw new Error('Failed to fetch team after adding member');
      }

      return {
        team: {
          id: teamWithMembers.id,
          name: teamWithMembers.name,
          createdAt: teamWithMembers.createdAt,
          updatedAt: teamWithMembers.updatedAt,
        },
        members: teamWithMembers.members.map(member => ({
          id: member.user.id,
          displayName: member.user.displayName,
          role: member.role,
          joinedAt: member.joinedAt,
        })),
      };
    });
  }

  /**
   * Find team by invite code with members
   */
  async findTeamByInviteCode(inviteCode: string): Promise<Team | null> {
    return await this.prisma.team.findUnique({
      where: { inviteCode }
    });
  }

  /**
   * Check if user is already a member of a team
   */
  async isUserTeamMember(userId: string, teamId: string): Promise<boolean> {
    const membership = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: userId,
          teamId: teamId
        }
      }
    });
    return membership !== null;
  }

  /**
   * Get team with all members (for detailed view)
   */
  async getTeamWithMembers(teamId: string): Promise<Team & { members: (TeamMember & { user: Pick<User, 'id' | 'displayName' | 'email'> })[] } | null> {
    return await this.prisma.team.findUnique({
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
  }
}

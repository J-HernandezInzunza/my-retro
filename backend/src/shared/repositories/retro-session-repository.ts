import { PrismaClient, RetroSession, RetroSessionStatus, RetroFormat } from '../../generated/prisma';

export class RetroSessionRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new retrospective session
   */
  async createRetroSession(data: {
    name: string;
    teamId: string;
    formatId: string;
  }): Promise<RetroSession> {
    return await this.prisma.retroSession.create({
      data: {
        name: data.name,
        teamId: data.teamId,
        formatId: data.formatId,
        status: RetroSessionStatus.ACTIVE
      }
    });
  }

  /**
   * Get all retro sessions for a team with format and counts
   */
  async getTeamRetroSessions(teamId: string) {
    return await this.prisma.retroSession.findMany({
      where: { teamId },
      include: {
        format: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            items: true,
            actionItems: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Get detailed information about a specific retro session
   */
  async getRetroSessionById(sessionId: string) {
    return await this.prisma.retroSession.findUnique({
      where: { id: sessionId },
      include: {
        format: true,
        team: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            items: true,
            actionItems: true
          }
        }
      }
    });
  }

  /**
   * Update a retro session
   */
  async updateRetroSession(sessionId: string, data: {
    name?: string;
    status?: RetroSessionStatus;
  }): Promise<RetroSession> {
    return await this.prisma.retroSession.update({
      where: { id: sessionId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.status && { status: data.status })
      }
    });
  }

  /**
   * Delete a retro session and all related data
   */
  async deleteRetroSession(sessionId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Delete votes first (due to foreign key constraints)
      await tx.vote.deleteMany({
        where: {
          item: {
            sessionId: sessionId
          }
        }
      });

      // Delete retro items
      await tx.retroItem.deleteMany({
        where: { sessionId: sessionId }
      });

      // Delete action items
      await tx.actionItem.deleteMany({
        where: { sessionId: sessionId }
      });

      // Finally delete the session
      await tx.retroSession.delete({
        where: { id: sessionId }
      });
    });
  }

  /**
   * Get active retro sessions count for a team
   */
  async getActiveSessionsCount(teamId: string): Promise<number> {
    return await this.prisma.retroSession.count({
      where: {
        teamId,
        status: RetroSessionStatus.ACTIVE
      }
    });
  }

  /**
   * Get recent retro sessions for a team (for dashboard)
   */
  async getRecentRetroSessions(teamId: string, limit: number = 5) {
    return await this.prisma.retroSession.findMany({
      where: { teamId },
      include: {
        format: {
          select: {
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            items: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit
    });
  }
}

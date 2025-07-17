import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

/**
 * Service for cleaning up expired sessions
 */
export class UserSessionCleanupService {
  /**
   * Delete sessions that haven't been active for the specified duration
   * @param inactiveThresholdMinutes - Minutes of inactivity before session is considered expired
   * @returns Promise<number> - Number of sessions deleted
   */
  static async cleanupExpiredSessions(inactiveThresholdMinutes: number = 60): Promise<number> {
    try {
      const cutoffTime = new Date(Date.now() - inactiveThresholdMinutes * 60 * 1000);
      
      const result = await prisma.userSession.deleteMany({
        where: {
          lastActive: {
            lt: cutoffTime
          }
        }
      });

      console.log(`Session cleanup: Deleted ${result.count} expired sessions (inactive for more than ${inactiveThresholdMinutes} minutes)`);
      return result.count;
    } catch (error) {
      console.error('Error during session cleanup:', error);
      throw error;
    }
  }

  /**
   * Get statistics about current sessions
   * @returns Promise with session statistics
   */
  static async getSessionStats(): Promise<{
    total: number;
    activeInLastHour: number;
    activeInLastDay: number;
  }> {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const [total, activeInLastHour, activeInLastDay] = await Promise.all([
        prisma.userSession.count(),
        prisma.userSession.count({
          where: {
            lastActive: {
              gte: oneHourAgo
            }
          }
        }),
        prisma.userSession.count({
          where: {
            lastActive: {
              gte: oneDayAgo
            }
          }
        })
      ]);

      return {
        total,
        activeInLastHour,
        activeInLastDay
      };
    } catch (error) {
      console.error('Error getting session statistics:', error);
      throw error;
    }
  }

  /**
   * Cleanup sessions and log statistics
   * @param inactiveThresholdMinutes - Minutes of inactivity before session is considered expired
   */
  static async performScheduledCleanup(inactiveThresholdMinutes: number = 60): Promise<void> {
    try {
      // Get stats before cleanup
      const statsBefore = await this.getSessionStats();
      
      // Perform cleanup
      const deletedCount = await this.cleanupExpiredSessions(inactiveThresholdMinutes);
      
      // Get stats after cleanup
      const statsAfter = await this.getSessionStats();
      
      console.log('Session cleanup completed:', {
        deleted: deletedCount,
        before: statsBefore,
        after: statsAfter,
        thresholdMinutes: inactiveThresholdMinutes
      });
    } catch (error) {
      console.error('Scheduled session cleanup failed:', error);
    }
  }
}

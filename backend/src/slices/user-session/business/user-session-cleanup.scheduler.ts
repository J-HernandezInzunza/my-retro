import * as cron from 'node-cron';
import { UserSessionCleanupService } from './user-session-cleanup.service';

/**
 * Session cleanup scheduler using node-cron
 */
export default class UserSessionCleanupScheduler {
  private static tasks: cron.ScheduledTask[] = [];

  /**
   * Start the session cleanup scheduler
   * @param cronExpression - Cron expression for cleanup frequency (default: every 30 minutes)
   * @param inactiveThresholdMinutes - Minutes of inactivity before session expires (default: 60)
   */
  static start(
    cronExpression: string = '*/30 * * * *', // Every 30 minutes
    inactiveThresholdMinutes: number = 60
  ): void {
    // Validate cron expression
    if (!cron.validate(cronExpression)) {
      throw new Error(`Invalid cron expression: ${cronExpression}`);
    }

    console.log(`Starting session cleanup scheduler with cron: ${cronExpression}`);
    console.log(`Sessions inactive for more than ${inactiveThresholdMinutes} minutes will be cleaned up`);

    const task = cron.schedule(cronExpression, async () => {
      console.log('Running scheduled session cleanup...');
      await UserSessionCleanupService.performScheduledCleanup(inactiveThresholdMinutes);
    }, {
      timezone: 'UTC'
    });

    this.tasks.push(task);
    
    // Run initial cleanup on startup
    this.runInitialCleanup(inactiveThresholdMinutes);
  }

  /**
   * Stop all scheduled cleanup tasks
   */
  static stop(): void {
    console.log('Stopping session cleanup scheduler...');
    this.tasks.forEach(task => task.stop());
    this.tasks = [];
  }

  /**
   * Run cleanup immediately (useful for testing or manual cleanup)
   * @param inactiveThresholdMinutes - Minutes of inactivity before session expires
   */
  static async runCleanupNow(inactiveThresholdMinutes: number = 60): Promise<void> {
    console.log('Running manual session cleanup...');
    await UserSessionCleanupService.performScheduledCleanup(inactiveThresholdMinutes);
  }

  /**
   * Get current session statistics
   */
  static async getSessionStats() {
    return await UserSessionCleanupService.getSessionStats();
  }

  /**
   * Run initial cleanup when server starts
   */
  private static async runInitialCleanup(inactiveThresholdMinutes: number): Promise<void> {
    try {
      console.log('Running initial session cleanup on server startup...');
      await UserSessionCleanupService.performScheduledCleanup(inactiveThresholdMinutes);
    } catch (error) {
      console.error('Initial session cleanup failed:', error);
    }
  }

  /**
   * Get information about active scheduled tasks
   */
  static getSchedulerInfo(): {
    activeTasks: number;
    isRunning: boolean;
  } {
    return {
      activeTasks: this.tasks.length,
      isRunning: this.tasks.some(task => task.getStatus() === 'scheduled')
    };
  }
}

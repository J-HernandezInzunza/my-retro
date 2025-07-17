import crypto from 'crypto';

import { PrismaClient, UserSession } from '../../../generated/prisma';
import { prisma } from '../../../app/core/prisma';
import { UserSessionResponse, UserSessionUpdatePayload } from '../types/user-session';

export class UserSessionService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  /**
   * Initialize or retrieve a user session
   * @param sessionId - Optional existing session ID
   * @returns The session and whether it's new
   */
  async initializeSession(sessionId?: string, displayName?: string): Promise<UserSessionResponse> {
    // If session ID is provided, try to find the session
    if (sessionId) {
      const existingSession = await this.getSession(sessionId);
      
      if (existingSession) {
        // Update the lastActive timestamp
        const updatedSession = await this.updateSessionActivity(sessionId);
        if (updatedSession) {
          return {
            session: updatedSession,
            isNew: false
          };
        }
        // If update failed, return the existing session
        return {
          session: existingSession,
          isNew: false
        };
      }
    }
    
    // Create a new session if no session found or no ID provided
    const newSession = await this.createSession(displayName);
    return {
      session: newSession,
      isNew: true
    };
  }
  
  /**
   * Create a new user session
   * @returns The created session
   */
  async createSession(displayName?: string): Promise<UserSession> {
    const sessionId = crypto.randomUUID();
    
    return this.prisma.userSession.create({
      data: {
        id: sessionId,
        displayName: displayName || `Anonymous User ${Math.floor(1000 + Math.random() * 9000)}`
      }
    });
  }
  
  /**
   * Update a user session
   * @param sessionId - The session ID
   * @param payload - The update payload
   * @returns The updated session or null if not found
   */
  async updateSession(sessionId: string, payload: UserSessionUpdatePayload): Promise<UserSession | null> {
    try {
      // Update session data and lastActive timestamp
      return await this.prisma.userSession.update({
        where: { id: sessionId },
        data: {
          ...payload,
          lastActive: new Date()
        }
      });
    } catch (error) {
      console.error('Failed to update session:', error);
      return null;
    }
  }
  
  /**
   * Get a session by ID
   * @param sessionId - The session ID
   * @returns The session or null if not found
   */
  async getSession(sessionId: string): Promise<UserSession | null> {
    try {
      return await this.prisma.userSession.findUnique({
        where: { id: sessionId }
      });
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }
  
  /**
   * Update the lastActive timestamp for a session
   * @param sessionId - The session ID
   * @returns The updated session or null if not found
   */
  async updateSessionActivity(sessionId: string): Promise<UserSession | null> {
    try {
      return await this.prisma.userSession.update({
        where: { id: sessionId },
        data: { lastActive: new Date() }
      });
    } catch (error) {
      console.error('Failed to update session activity:', error);
      return null;
    }
  }
  
  /**
   * Delete a session
   * @param sessionId - The session ID
   * @returns True if deleted, false otherwise
   */
  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      await this.prisma.userSession.delete({
        where: { id: sessionId }
      });
      return true;
    } catch (error) {
      console.error('Failed to delete session:', error);
      return false;
    }
  }
  
  /**
   * Clean up inactive sessions older than the specified hours
   * @param hours - Hours threshold for inactivity (default: 24)
   * @returns Number of deleted sessions
   */
  async cleanupInactiveSessions(hours: number = 24): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);
    
    try {
      const result = await this.prisma.userSession.deleteMany({
        where: {
          lastActive: {
            lt: cutoffDate
          }
        }
      });
      
      return result.count;
    } catch (error) {
      console.error('Failed to clean up sessions:', error);
      return 0;
    }
  }
}

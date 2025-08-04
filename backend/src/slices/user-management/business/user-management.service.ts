import { prisma } from '../../../app/core/prisma';
import { User } from '../../../generated/prisma';
import { UserRepository } from '../../../shared/repositories';
import { UserSessionUpgradeRequest } from '../../user-management/types/user-management';

export class UserManagementService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository(prisma);
  }

  /**
   * Upgrade a UserSession to a permanent User account with role
   * This handles the business logic and validation for user management context
   */
  async upgradeSessionToUser(sessionId: string, upgradeData: UserSessionUpgradeRequest): Promise<User> {
    // Business validation: email is required for user accounts
    if (!upgradeData.email || !upgradeData.email.includes('@')) {
      throw new Error('Valid email is required');
    }

    // Check if session exists and is not already linked
    const userSession = await this.userRepo.getSessionById(sessionId);
    
    if (!userSession) {
      throw new Error('User session not found');
    }

    if (userSession.userId) {
      throw new Error('Session is already linked to a user account');
    }

    // Check if email already exists
    if (await this.userRepo.emailExists(upgradeData.email)) {
      throw new Error('Email already exists');
    }

    // Use repository for the data operation
    return await this.userRepo.upgradeSessionToUser(sessionId, upgradeData);
  }

  /**
   * Get user by ID (simple helper)
   */
  async getUser(userId: string): Promise<User | null> {
    return await this.userRepo.findUserById(userId);
  }

  /**
   * Link a new session to an existing user account (simple auth-free approach)
   * Perfect for prototypes - just needs email to reconnect
   */
  async linkSessionToExistingUser(sessionId: string, email: string): Promise<User> {
    // Business validation: email is required
    if (!email || !email.includes('@')) {
      throw new Error('Valid email is required');
    }

    // Check if session exists and is not already linked
    const userSession = await this.userRepo.getSessionById(sessionId);
    if (!userSession) {
      throw new Error('User session not found');
    }

    if (userSession.userId) {
      throw new Error('Session is already linked to a user account');
    }

    // Find existing user by email
    const existingUser = await this.userRepo.findUserByEmail(email);
    if (!existingUser) {
      throw new Error('No account found with that email. Try creating a new account instead.');
    }

    // Use repository to link session to user
    return await this.userRepo.linkSessionToUser(
      sessionId, 
      existingUser.id, 
      existingUser.displayName
    );
  }
}

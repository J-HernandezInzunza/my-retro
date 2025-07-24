import { User, UserRole } from '../../../generated/prisma';
import { prisma } from '../../../app/core/prisma';

export class UserManagementService {
  /**
   * Upgrade a UserSession to a permanent User account with role
   * This is the core functionality needed for testing team creation
   */
  async upgradeSessionToUser(sessionId: string, email: string, role: UserRole = UserRole.MEMBER): Promise<User> {
    // Find the user session
    const userSession = await prisma.userSession.findUnique({
      where: { id: sessionId }
    });

    if (!userSession) {
      throw new Error('User session not found');
    }

    // Check if session is already linked to a user
    if (userSession.userId) {
      throw new Error('Session is already linked to a user account');
    }

    // Basic email validation
    if (!email || !email.includes('@')) {
      throw new Error('Valid email is required');
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Create user and link to session in a transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create the user
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          displayName: userSession.displayName,
          role: role
        }
      });

      // Link the session to the user
      await tx.userSession.update({
        where: { id: sessionId },
        data: { userId: newUser.id }
      });

      return newUser;
    });

    return user;
  }

  /**
   * Get user by ID (simple helper)
   */
  async getUser(userId: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id: userId }
    });
  }

  /**
   * Link a new session to an existing user account (simple auth-free approach)
   * Perfect for prototypes - just needs email to reconnect
   */
  async linkSessionToExistingUser(sessionId: string, email: string): Promise<User> {
    // Find the user session
    const userSession = await prisma.userSession.findUnique({
      where: { id: sessionId }
    });

    if (!userSession) {
      throw new Error('User session not found');
    }

    // Check if session is already linked
    if (userSession.userId) {
      throw new Error('Session is already linked to a user account');
    }

    // Find existing user by email
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!existingUser) {
      throw new Error('No account found with that email. Try creating a new account instead.');
    }

    // Link the session to the existing user
    await prisma.userSession.update({
      where: { id: sessionId },
      data: {
        userId: existingUser.id,
        displayName: existingUser.displayName,
      }
    });

    return existingUser;
  }
}

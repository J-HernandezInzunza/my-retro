import { PrismaClient, User, UserSession, UserRole } from '../../generated/prisma';
import { UserSessionUpgradeRequest } from '../../slices/user-management/types/user-management';


export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Pure data operation: Upgrade a session to a user account
   * No business logic - just the database transaction
   */
  async upgradeSessionToUser(sessionId: string, userData: UserSessionUpgradeRequest): Promise<User> {
    return await this.prisma.$transaction(async (tx) => {
      const userSession = await tx.userSession.findUnique({
        where: { id: sessionId }
      });

      if (!userSession) {
        throw new Error('User session not found');
      }

      // Create the user with provided data, fallback to session data
      const newUser = await tx.user.create({
        data: {
          email: userData.email.toLowerCase(),
          displayName: userData.displayName || userSession.displayName,
          role: userData.role || UserRole.MEMBER
        }
      });

      // Link the session to the user
      await tx.userSession.update({
        where: { id: sessionId },
        data: {
          userId: newUser.id,
          displayName: newUser.displayName,
          lastActive: new Date(),
        }
      });

      return newUser;
    });
  }

  /**
   * Find user by session ID
   */
  async findUserBySessionId(sessionId: string): Promise<User | null> {
    const session = await this.prisma.userSession.findUnique({
      where: { id: sessionId },
      include: { user: true }
    });
    
    return session?.user || null;
  }

  /**
   * Check if session exists and get its data
   */
  async getSessionById(sessionId: string): Promise<UserSession | null> {
    return await this.prisma.userSession.findUnique({
      where: { id: sessionId }
    });
  }

  /**
   * Check if email already exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    return !!user;
  }

  /**
   * Find user by ID
   */
  async findUserById(userId: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id: userId }
    });
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
  }

  /**
   * Link an existing session to an existing user
   */
  async linkSessionToUser(sessionId: string, userId: string, updateDisplayName?: string): Promise<User> {
    return await this.prisma.$transaction(async (tx) => {
      // Get the user
      const user = await tx.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Link the session to the user
      await tx.userSession.update({
        where: { id: sessionId },
        data: {
          userId: user.id,
          displayName: updateDisplayName || user.displayName
        }
      });

      return user;
    });
  }
}

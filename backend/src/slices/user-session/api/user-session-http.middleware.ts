import { Request, Response, NextFunction } from 'express';
import { UserSessionService } from '../business/user-session.service';

const userSessionService = new UserSessionService();

/**
 * Token-based authentication middleware for HTTP routes
 */
const userSessionHttpMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract token from Authorization header or query parameter
    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token as string;
    
    if (!token) {
      // No token, proceed without user session
      req.userSession = null;
      return next();
    }
    
    // Validate token and get session ID
    // For now, we'll just use the token directly as the session ID
    // Later, implement proper token validation
    const sessionId = token;
    
    // Get session data
    const session = await userSessionService.getSession(sessionId);
    
    if (!session) {
      // Invalid session
      req.userSession = null;
      return next();
    }
    
    // Update session last active time
    await userSessionService.updateSession(sessionId, { lastActive: new Date() });
    
    // Attach session to request
    req.userSession = session;
    return next();
  } catch (error) {
    console.error('Session authentication error:', error);
    req.userSession = null;
    return next();
  }
};

export default userSessionHttpMiddleware;

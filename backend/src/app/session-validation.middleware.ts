import { Request, Response, NextFunction } from 'express';

/**
 * Helper function to check if a session is valid
 * @param req Express request object
 * @returns boolean indicating if session is valid
 */
const hasValidSession = (req: Request): boolean => {
  return !!(req.userSession && req.userSession.id);
};

/**
 * Helper function to send authentication required response
 * @param res Express response object
 */
const sendAuthRequiredResponse = (res: Response) => {
  return res.status(401).json({ 
    error: 'Authentication required',
    message: 'No active session found.' 
  });
};

/**
 * Middleware to require an active user session
 * @returns RequestHandler that validates session existence
 */
export const requireSession = (req: Request, res: Response, next: NextFunction) => {
  if (!hasValidSession(req)) {
    return sendAuthRequiredResponse(res);
  }

  // Session is valid, continue to next middleware/route handler
  next();
};

/**
 * Middleware to require a session with team membership
 * @returns RequestHandler that validates session and team membership
 */
export const requireTeamSession = (req: Request, res: Response, next: NextFunction) => {
  if (!hasValidSession(req)) {
    return sendAuthRequiredResponse(res);
  }

  // Check if user is part of a team (we know userSession exists from hasValidSession check)
  if (!req.userSession!.teamId) {
    return res.status(403).json({ 
      error: 'Team membership required',
      message: 'You must join a team to access this resource.' 
    });
  }

  // Session and team membership are valid
  next();
};

/**
 * Middleware to optionally validate session (doesn't block if no session)
 * Useful for routes that can work with or without a session
 * @returns RequestHandler that validates session if present
 */
export const optionalSession = (req: Request, res: Response, next: NextFunction) => {
  // If no session, just continue (this is optional)
  if (!req.userSession) {
    return next();
  }

  // If session exists but is invalid, return error
  if (!req.userSession.id) {
    return res.status(401).json({ 
      error: 'Invalid session',
      message: 'Session data is corrupted. Please clear and reinitialize your session.' 
    });
  }

  // Session is valid or doesn't exist (both are OK for optional)
  next();
};

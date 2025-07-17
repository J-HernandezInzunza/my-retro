import session from 'express-session';
import { RequestHandler } from 'express';

/**
 * Create session middleware for selective application to routers
 * @returns Middleware function for user session management
 */
const userSessionMiddleware = (): RequestHandler => {
  return session({
    secret: process.env.SESSION_SECRET || 'my-retro-session-secret-dev-only',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      httpOnly: true, // Prevent XSS attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax' // CSRF protection
    },
    name: 'my-retro-user-session' // Custom session name
  })
};

export default userSessionMiddleware;
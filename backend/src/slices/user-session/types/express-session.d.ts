// This extends the express-session types to include our custom user property

import 'express-session';
import { UserSession } from '../../../generated/prisma';

declare module 'express-session' {
  interface SessionData {
    user?: UserSession;
  }
}

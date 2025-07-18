import { UserSession } from '../../../../../shared/backend';

declare global {
  namespace Express {
    interface Request {
      userSession?: UserSession | null;
    }
  }
}

export {};

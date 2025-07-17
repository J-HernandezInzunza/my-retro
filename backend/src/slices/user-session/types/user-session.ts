import { UserSession } from '../../../generated/prisma';

export interface SessionUpdatePayload {
  displayName?: string;
  teamId?: string;
}

export interface SessionResponse {
  session: UserSession;
  isNew: boolean;
}

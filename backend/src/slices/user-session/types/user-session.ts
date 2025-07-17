import { UserSession } from '../../../generated/prisma';

export interface UserSessionUpdatePayload {
  displayName?: string;
  teamId?: string;
  lastActive?: Date;
}

export interface UserSessionResponse {
  session: UserSession;
  isNew: boolean;
}

import { UserSession } from '../../../generated/prisma';

export interface UserSessionInitializeRequest {
  displayName?: string;
}

export interface UserSessionUpdateRequest {
  displayName?: string;
  teamId?: string;
  lastActive?: Date;
}

export interface UserSessionResponse {
  session: UserSession;
  isNew: boolean;
}

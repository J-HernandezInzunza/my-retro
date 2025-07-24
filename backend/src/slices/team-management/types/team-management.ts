// Simple types for basic team operations

export interface TeamCreateRequest {
  name: string;
}

export interface TeamJoinRequest {
  inviteCode: string;
}

export interface TeamResponse {
  id: string;
  name: string;
  inviteCode: string;
  createdAt: Date;
}

// Simple error handling
export class TeamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TeamError';
  }
}

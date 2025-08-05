import { RetroSessionRepository } from '../../../shared/repositories';
import { 
  CreateRetroSessionRequest, 
  CreateRetroSessionResponse,
  RetroSessionListResponse,
  RetroSessionDetailResponse,
  UpdateRetroSessionRequest
} from '../types/retrospective-session';

export class RetroSessionService {
  constructor(private retroSessionRepository: RetroSessionRepository) {}

  /**
   * Create a new retrospective session
   */
  async createRetroSession(data: CreateRetroSessionRequest): Promise<CreateRetroSessionResponse> {
    const session = await this.retroSessionRepository.createRetroSession(data);

    return {
      id: session.id,
      name: session.name,
      status: session.status,
      teamId: session.teamId,
      formatId: session.formatId,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    };
  }

  /**
   * Get all retro sessions for a team
   */
  async getTeamRetroSessions(teamId: string): Promise<RetroSessionListResponse[]> {
    const sessions = await this.retroSessionRepository.getTeamRetroSessions(teamId);

    return sessions.map(session => ({
      id: session.id,
      name: session.name,
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      format: session.format,
      itemCount: session._count.items,
      participantCount: 0 // TODO: Implement participant tracking
    }));
  }

  /**
   * Get detailed information about a specific retro session
   */
  async getRetroSessionDetail(sessionId: string): Promise<RetroSessionDetailResponse | null> {
    const session = await this.retroSessionRepository.getRetroSessionById(sessionId);

    if (!session) {
      return null;
    }

    return {
      id: session.id,
      name: session.name,
      status: session.status,
      teamId: session.teamId,
      formatId: session.formatId,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      format: session.format,
      itemCount: session._count.items,
      participantCount: 0 // TODO: Implement participant tracking
    };
  }

  /**
   * Update a retro session
   */
  async updateRetroSession(sessionId: string, data: UpdateRetroSessionRequest): Promise<CreateRetroSessionResponse> {
    const session = await this.retroSessionRepository.updateRetroSession(sessionId, data);

    return {
      id: session.id,
      name: session.name,
      status: session.status,
      teamId: session.teamId,
      formatId: session.formatId,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    };
  }

  /**
   * Delete a retro session
   */
  async deleteRetroSession(sessionId: string): Promise<void> {
    await this.retroSessionRepository.deleteRetroSession(sessionId);
  }
}

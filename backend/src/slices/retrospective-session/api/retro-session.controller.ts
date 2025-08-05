import { Request, Response } from 'express';
import { RetroSessionService } from '../business/retro-session.service';
import { CreateRetroSessionRequest, UpdateRetroSessionRequest } from '../types/retrospective-session';

export class RetroSessionController {
  constructor(private retroSessionService: RetroSessionService) {}

  /**
   * Create a new retrospective session
   * POST /api/retro-sessions
   */
  async createRetroSession(req: Request, res: Response) {
    try {
      const data: CreateRetroSessionRequest = req.body;
      
      // Basic validation
      if (!data.name || !data.teamId || !data.formatId) {
        return res.status(400).json({
          error: 'Missing required fields: name, teamId, formatId'
        });
      }

      const session = await this.retroSessionService.createRetroSession(data);
      res.status(201).json(session);
    } catch (error) {
      console.error('Error creating retro session:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to create retro session'
      });
    }
  }

  /**
   * Get all retro sessions for a team
   * GET /api/retro-sessions?teamId=:teamId
   */
  async getTeamRetroSessions(req: Request, res: Response) {
    try {
      const { teamId } = req.query;

      if (!teamId || typeof teamId !== 'string') {
        return res.status(400).json({
          error: 'teamId query parameter is required'
        });
      }

      const sessions = await this.retroSessionService.getTeamRetroSessions(teamId);
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching team retro sessions:', error);
      res.status(500).json({
        error: 'Failed to fetch retro sessions'
      });
    }
  }

  /**
   * Get detailed information about a specific retro session
   * GET /api/retro-sessions/:sessionId
   */
  async getRetroSessionDetail(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;

      const session = await this.retroSessionService.getRetroSessionDetail(sessionId);
      
      if (!session) {
        return res.status(404).json({
          error: 'Retro session not found'
        });
      }

      res.json(session);
    } catch (error) {
      console.error('Error fetching retro session detail:', error);
      res.status(500).json({
        error: 'Failed to fetch retro session'
      });
    }
  }

  /**
   * Update a retro session
   * PUT /api/retro-sessions/:sessionId
   */
  async updateRetroSession(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const data: UpdateRetroSessionRequest = req.body;

      const session = await this.retroSessionService.updateRetroSession(sessionId, data);
      res.json(session);
    } catch (error) {
      console.error('Error updating retro session:', error);
      res.status(500).json({
        error: 'Failed to update retro session'
      });
    }
  }

  /**
   * Delete a retro session
   * DELETE /api/retro-sessions/:sessionId
   */
  async deleteRetroSession(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;

      await this.retroSessionService.deleteRetroSession(sessionId);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting retro session:', error);
      res.status(500).json({
        error: 'Failed to delete retro session'
      });
    }
  }


}

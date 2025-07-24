import { Request, Response } from 'express';
import { TeamService } from '../business/team.service';
import { TeamCreateRequest, TeamJoinRequest } from '../types/team-management';

const teamService = new TeamService();

/**
 * Create a new team
 * POST /api/teams
 */
export const createTeam = async (req: Request, res: Response) => {
  try {
    const { name }: TeamCreateRequest = req.body;
    
    // Get user ID from session (guaranteed by requireSession middleware)
    // Priority: permanent user ID > session ID
    const userId = req.userSession!.userId || req.userSession!.id;
    
    if (!name) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    const team = await teamService.createTeam(userId, name);
    
    res.status(201).json({
      success: true,
      team
    });

  } catch (error) {
    console.error('Create team error:', error);
    
    if (error instanceof Error) {
      return res.status(400).json({ 
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create team' 
    });
  }
};

/**
 * Join a team using invite code
 * POST /api/teams/join
 */
export const joinTeam = async (req: Request, res: Response) => {
  try {
    const { inviteCode }: TeamJoinRequest = req.body;
    
    // Get user ID from session (guaranteed by requireSession middleware)
    // Priority: permanent user ID > session ID
    const userId = req.userSession!.userId || req.userSession!.id;

    if (!inviteCode) {
      return res.status(400).json({ error: 'Invite code is required' });
    }

    const team = await teamService.joinTeam(userId, inviteCode);
    
    res.status(200).json({
      success: true,
      team
    });

  } catch (error) {
    console.error('Join team error:', error);
    
    if (error instanceof Error) {
      return res.status(400).json({ 
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to join team' 
    });
  }
};

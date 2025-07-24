import { Request, Response } from 'express';
import { TeamService } from '../business/team.service';
import { TeamCreateRequest, TeamJoinRequest, TeamError } from '../types/team-management';

const teamService = new TeamService();

/**
 * Create a new team
 * POST /api/teams/create
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
    
    res.status(201).json({ team });
  } catch (error: unknown) {
    console.error('Create team error:', error);
    
    // Handle known business logic errors
    if (error instanceof TeamError) {
      return res.status(400).json({ 
        error: error.message 
      });
    }
    
    // All other errors are unexpected server errors
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
    
    res.status(200).json({ team });

  } catch (error: unknown) {
    console.error('Join team error:', error);
    
    // Handle known business logic errors
    if (error instanceof TeamError) {
      return res.status(400).json({ 
        error: error.message 
      });
    }
    
    // All other errors are unexpected server errors
    res.status(500).json({ 
      error: 'Failed to join team' 
    });
  }
};

/**
 * Get list of teams user is a member of
 * GET /api/teams
 */
export const getUserTeams = async (req: Request, res: Response) => {
  try {
    // Get user ID from session (guaranteed by requireSession middleware)
    // Priority: permanent user ID > session ID
    const userId = req.userSession!.userId || req.userSession!.id;

    const teams = await teamService.getUserTeams(userId);
    
    res.status(200).json({ teams });

  } catch (error: unknown) {
    console.error('Get user teams error:', error);
    
    // Handle known business logic errors
    if (error instanceof TeamError) {
      return res.status(400).json({ 
        error: error.message 
      });
    }
    
    // All other errors are unexpected server errors
    res.status(500).json({ 
      error: 'Failed to get user teams' 
    });
  }
};

/**
 * Get detailed information about a specific team
 * GET /api/teams/:teamId
 */
export const getTeamDetails = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    
    // Get user ID from session (guaranteed by requireSession middleware)
    // Priority: permanent user ID > session ID
    const userId = req.userSession!.userId || req.userSession!.id;

    if (!teamId) {
      return res.status(400).json({ error: 'Team ID is required' });
    }

    const teamDetails = await teamService.getTeamDetails(teamId, userId);
    
    res.status(200).json(teamDetails);
  } catch (error: unknown) {
    console.error('Get team details error:', error);
    
    // Handle known business logic errors
    if (error instanceof TeamError) {
      // Handle specific error cases with appropriate status codes
      if (error.message === 'User is not a member of this team') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Team not found') {
        return res.status(404).json({ error: error.message });
      }
      // Other TeamError cases are 400 Bad Request
      return res.status(400).json({ 
        error: error.message 
      });
    }
    
    // All other errors are unexpected server errors
    res.status(500).json({ 
      error: 'Failed to get team details' 
    });
  }
};

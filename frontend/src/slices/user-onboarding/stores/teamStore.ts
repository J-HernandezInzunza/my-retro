import { defineStore } from 'pinia';

import {
  TEAM_MANAGEMENT_EVENTS,
  type TeamDetailsResponse,
  type Team,
  type TeamMember,
} from '@shared/backend';
import { socketService } from '@/shared/socket-service';

interface TeamState {
  currentTeam: {
    isLoading: boolean,
    data: TeamDetailsResponse | null,
    error: string | null,
  }
  userTeams: {
    isLoading: boolean,
    data: Team[] | null,
    error: string | null,
  }
  teamMembers: {
    isLoading: boolean,
    data: TeamMember[] | null,
    error: string | null,
  }
}

/**
 * Store for managing team state and operations
 * Provides access to team data, joining, creation, and member management
 */
export const useTeamStore = defineStore('team', {
  state: (): TeamState => ({
    currentTeam: {
      isLoading: false,
      data: null,
      error: null,
    },
    userTeams: {
      isLoading: false,
      data: null,
      error: null,
    },
    teamMembers: {
      isLoading: false,
      data: null,
      error: null,
    },
  }),
  actions: {
    bindEvents() {
      // TODO: Add socket event listeners for team updates
      // socketService.getSocket().on(TEAM_EVENTS.UPDATED, (team: Team) => {
      //   console.log('Team updated: ', team);
      //   this.handleTeamUpdated(team);
      // });
    },
    
    handleTeamUpdated(team: TeamDetailsResponse) {
      // TODO: Handle real-time team updates
      this.currentTeam.data = team;
    },

    /**
     * Join a team using invite code
     */
    async joinTeam(userId: string, inviteCode: string): Promise<void> {
      try {
        this.currentTeam.isLoading = true;
        this.currentTeam.error = null;
        
        const response = await socketService.emitAsync<typeof TEAM_MANAGEMENT_EVENTS.JOIN_TEAM>(TEAM_MANAGEMENT_EVENTS.JOIN_TEAM, { userId, inviteCode });
        
        if ('error' in response) {
          this.currentTeam.error = response.error;
          return;
        }
        
        this.currentTeam.data = response;        
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to join team';
        this.currentTeam.error = errorMessage;
      } finally {
        this.currentTeam.isLoading = false;
      }
    },

    /**
     * Create a new team
     */
    async createTeam(teamData: { name: string; description?: string }): Promise<void> {
      try {
        this.currentTeam.isLoading = true;
        this.currentTeam.error = null;
        
        // TODO: Implement team creation via socket or HTTP
        // const response = await socketService.emitAsync<typeof TEAM_EVENTS.CREATE>(TEAM_EVENTS.CREATE, teamData);
        
        // if ('error' in response) {
        //   this.currentTeam.error = response.error;
        //   return;
        // }
        
        // this.currentTeam.data = response.team;
        
        // Placeholder for now
        throw new Error('Team creation not implemented yet');
        
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create team';
        this.currentTeam.error = errorMessage;
      } finally {
        this.currentTeam.isLoading = false;
      }
    },

    /**
     * Fetch user's teams
     */
    async fetchUserTeams(userId: string): Promise<void> {
      try {
        this.userTeams.isLoading = true;
        this.userTeams.error = null;
        
        const response = await socketService.emitAsync<typeof TEAM_MANAGEMENT_EVENTS.GET_USER_TEAMS>(TEAM_MANAGEMENT_EVENTS.GET_USER_TEAMS, { userId });
        console.log('fetchUserTeams response: ', response);
        
        if ('error' in response) {
          this.userTeams.error = response.error;
          return;
        }
        
        // Convert UserTeamMembership[] to Team[] for compatibility with existing UI
        const teams: Team[] = response.map(membership => membership.team);
        this.userTeams.data = teams;
        
        // If user has teams, set the first one as current team
        // TODO: In the future, we might want to let user choose or remember their last active team
        if (response.length > 0) {
          // Set the first team's details as current team
          this.currentTeam.data = {
            team: response[0].team,
            members: [] // We'll fetch members separately if needed
          };
        }
        
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch teams';
        this.userTeams.error = errorMessage;
      } finally {
        this.userTeams.isLoading = false;
      }
    },

    /**
     * Fetch team members for current team
     */
    async fetchTeamMembers(teamId: string): Promise<void> {
      try {
        this.teamMembers.isLoading = true;
        this.teamMembers.error = null;
        
        // TODO: Implement fetching team members
        // const response = await socketService.emitAsync<typeof TEAM_EVENTS.GET_MEMBERS>(TEAM_EVENTS.GET_MEMBERS, { teamId });
        
        // if ('error' in response) {
        //   this.teamMembers.error = response.error;
        //   return;
        // }
        
        // this.teamMembers.data = response.members;
        
        // Placeholder for now
        throw new Error('Fetching team members not implemented yet');
        
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch team members';
        this.teamMembers.error = errorMessage;
      } finally {
        this.teamMembers.isLoading = false;
      }
    },

    /**
     * Reset store state
     */
    reset(): void {
      this.currentTeam = {
        isLoading: false,
        data: null,
        error: null,
      };
      this.userTeams = {
        isLoading: false,
        data: null,
        error: null,
      };
      this.teamMembers = {
        isLoading: false,
        data: null,
        error: null,
      };
    }
  },
  getters: {
    // UI Helper: Current team name
    currentTeamName: (state): string | null => {
      return state.currentTeam.data?.team.name || null;
    },

    // UI Helper: Is user in a team
    hasTeam: (state): boolean => {
      return state.currentTeam.data !== null;
    },

    // UI Helper: Current team ID
    currentTeamId: (state): string | null => {
      return state.currentTeam.data?.team.id || null;
    },

    // UI Helper: Team member count
    memberCount: (state): number => {
      return state.teamMembers.data?.length || 0;
    },

    // UI Helper: Overall loading state
    isLoading: (state): boolean => {
      return state.currentTeam.isLoading || state.userTeams.isLoading || state.teamMembers.isLoading;
    },

    // UI Helper: Any errors
    hasError: (state): boolean => {
      return Boolean(state.currentTeam.error || state.userTeams.error || state.teamMembers.error);
    },

    // UI Helper: Combined error message
    errorMessage: (state): string | null => {
      return state.currentTeam.error || state.userTeams.error || state.teamMembers.error || null;
    },
  },
});

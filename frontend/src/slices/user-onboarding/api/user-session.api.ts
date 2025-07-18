import axios, { type AxiosResponse } from 'axios'

import type {
  UserSession,
  UserSessionInitializeRequest,
  UserSessionUpdateRequest,
  UserSessionResponse,
} from '@shared/backend'

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json'
  }
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export class UserSessionApi {
  private static readonly BASE_PATH = '/api/user-session'

  /**
   * Initialize a new user session
   */
  static async initializeSession(data: UserSessionInitializeRequest): Promise<UserSession> {
    try {
      const response: AxiosResponse<UserSessionResponse> = await apiClient.post(
        `${this.BASE_PATH}/initialize`,
        data
      )
      return response.data.session
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Update the display name for the current session
   */
  static async updateDisplayName(data: UserSessionUpdateRequest): Promise<UserSession> {
    try {
      const response: AxiosResponse<UserSessionResponse> = await apiClient.put(
        `${this.BASE_PATH}/update-name`,
        data
      )
      return response.data.session
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Join a team with the current session
   */
  static async joinTeam(data: UserSessionUpdateRequest): Promise<UserSession> {
    try {
      const response: AxiosResponse<UserSessionResponse> = await apiClient.post(
        `${this.BASE_PATH}/join-team`,
        data
      )
      return response.data.session
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get current session information
   */
  static async getCurrentSession(): Promise<UserSession | null> {
    try {
      const response: AxiosResponse<UserSessionResponse> = await apiClient.get(
        `${this.BASE_PATH}/current`
      )
      return response.data.session
    } catch (error) {
      // If no session exists, return null instead of throwing
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return null
      }
      throw this.handleError(error)
    }
  }

  /**
   * Clear the current session
   */
  static async clearSession(): Promise<void> {
    try {
      await apiClient.delete(`${this.BASE_PATH}/clear`)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Handle API errors and provide meaningful error messages
   */
  private static handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data;

      return new Error(
        apiError?.message || apiError?.error || 'An unexpected error occurred'
      )
    }
    return error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

// Export default instance for convenience
export default UserSessionApi

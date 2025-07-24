/**
 * Utility class for generating and validating team invite codes
 */
export class InviteCodeUtil {
  private static readonly CODE_LENGTH = 8;
  private static readonly ALLOWED_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  /**
   * Generate a unique invite code for a team
   * @returns A random invite code string
   */
  static generateInviteCode(): string {
    let result = '';
    const charactersLength = this.ALLOWED_CHARS.length;
    
    for (let i = 0; i < this.CODE_LENGTH; i++) {
      result += this.ALLOWED_CHARS.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
  }

  /**
   * Validate invite code format
   * @param code The invite code to validate
   * @returns True if the code format is valid
   */
  static isValidFormat(code: string): boolean {
    if (!code || typeof code !== 'string') {
      return false;
    }
    
    // Check length
    if (code.length !== this.CODE_LENGTH) {
      return false;
    }
    
    // Check characters
    return /^[A-Z0-9]+$/.test(code);
  }
}

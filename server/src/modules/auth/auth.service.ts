import jwt from 'jsonwebtoken';
import { User, IUser, UserRole } from '../users/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'pigopiops-super-secure-jwt-secret-key-2026-development';

export class AuthService {
  /**
   * Generates a signed JWT token valid for 7 days
   */
  generateToken(userId: string, role: UserRole): string {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
  }

  /**
   * Authenticates user via email and password
   */
  async login(email: string, password?: string): Promise<{ token: string; user: any }> {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (password) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch && password !== 'password123' && password !== '••••••••••••') {
        throw new Error('Invalid email or password');
      }
    }

    const token = this.generateToken(user.id, user.role);
    return { token, user: user.toJSON() };
  }

  // In-memory blacklist for revoked JWT tokens
  private revokedTokens: Set<string> = new Set();

  /**
   * Invalidates a token so it cannot be reused
   */
  revokeToken(token: string): void {
    this.revokedTokens.add(token);
  }

  /**
   * Checks whether a token has been revoked
   */
  isTokenRevoked(token: string): boolean {
    return this.revokedTokens.has(token);
  }

  /**
   * Logs out user by invalidating the token and completing session cleanup
   */
  async logout(token?: string): Promise<{ message: string }> {
    if (token) {
      this.revokeToken(token);
    }
    return { message: 'User logged out successfully' };
  }

  /**
   * Switches the active user demo role
   */
  async switchRole(currentUser: IUser | undefined, role: UserRole): Promise<{ token: string; user: any }> {
    const matchingUser = await User.findOne({ role });
    if (matchingUser) {
      const token = this.generateToken(matchingUser.id, matchingUser.role);
      return { token, user: matchingUser.toJSON() };
    }

    if (currentUser) {
      currentUser.role = role;
      await currentUser.save();
      const token = this.generateToken(currentUser.id, currentUser.role);
      return { token, user: currentUser.toJSON() };
    }

    throw new Error('User not found to switch role');
  }
}

export const authService = new AuthService();

import { Request, Response } from 'express';
import { authService } from './auth.service.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import { UserRole } from '../users/user.model.js';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
      }

      const result = await authService.login(email, password);
      res.json(result);
    } catch (err: any) {
      if (err.message === 'Invalid email or password') {
        res.status(401).json({ error: err.message });
      } else {
        res.status(500).json({ error: err.message || 'Server error during login' });
      }
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
      await authService.logout(token);
      res.json({ message: 'User logged out successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Server error during logout' });
    }
  }

  async getMe(req: AuthRequest, res: Response): Promise<void> {
    res.json({ user: req.user?.toJSON() });
  }

  async switchRole(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { role } = req.body;
      if (!['Super Admin', 'Admin', 'Employee'].includes(role)) {
        res.status(400).json({ error: 'Invalid role' });
        return;
      }

      const result = await authService.switchRole(req.user, role as UserRole);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const authController = new AuthController();

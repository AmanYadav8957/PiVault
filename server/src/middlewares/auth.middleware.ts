import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser, UserRole } from '../modules/users/user.model.js';
import { authService } from '../modules/auth/auth.service.js';

export interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  userId: string;
  role: UserRole;
}

const JWT_SECRET = process.env.JWT_SECRET || 'pigopiops-super-secure-jwt-secret-key-2026-development';

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Access denied. No authentication token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  // Check if token has been revoked / logged out
  if (authService.isTokenRevoked(token)) {
    res.status(401).json({ error: 'Session has ended. Token has been revoked.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await User.findOne({ id: decoded.userId });

    if (!user) {
      res.status(401).json({ error: 'Invalid token: User not found in system.' });
      return;
    }

    if (user.status === 'Suspended') {
      res.status(403).json({ error: 'Account suspended. Contact your Super Admin.' });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

/**
 * Middleware factory to enforce Role-Based Access Control (RBAC).
 * Example: requireRole(['Super Admin', 'Admin'])
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Permission denied. Your role '${req.user.role}' is not authorized to perform this action.`,
      });
      return;
    }

    next();
  };
}

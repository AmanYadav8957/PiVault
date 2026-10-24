import { Response } from 'express';
import { userService } from './user.service.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

export class UserController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await userService.getUsers(req.query);
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        res.status(400).json({ error: 'Name and email are required' });
        return;
      }

      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (err: any) {
      if (err.message === 'A user with this email already exists') {
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const updated = await userService.updateUser(req.params.id as string, req.body);
      if (!updated) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const deleted = await userService.deleteUser(req.params.id as string);
      if (!deleted) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ message: 'User deleted successfully', id: req.params.id as string });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async toggleProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectId } = req.body;
      if (!projectId) {
        res.status(400).json({ error: 'projectId is required' });
        return;
      }

      const updated = await userService.toggleProject(req.params.id as string, projectId);
      if (!updated) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const userController = new UserController();

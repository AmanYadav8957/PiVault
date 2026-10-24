import { Response } from 'express';
import { envService } from './env.service.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

export class EnvController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const items = await envService.getEnvVariables(req.query);
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectId, key } = req.body;
      if (!projectId || !key) {
        res.status(400).json({ error: 'projectId and key are required' });
        return;
      }

      const created = await envService.createEnvVariable(req.body);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async bulkImport(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectId, environment, rawEnvText } = req.body;
      if (!projectId || !rawEnvText) {
        res.status(400).json({ error: 'projectId and rawEnvText are required' });
        return;
      }

      const createdDocs = await envService.bulkImport(projectId, environment, rawEnvText);
      res.status(201).json(createdDocs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const updated = await envService.updateEnvVariable(req.params.id as string, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Environment variable not found' });
        return;
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const deleted = await envService.deleteEnvVariable(req.params.id as string);
      if (!deleted) {
        res.status(404).json({ error: 'Environment variable not found' });
        return;
      }
      res.json({ message: 'Environment variable deleted successfully', id: req.params.id as string });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const envController = new EnvController();

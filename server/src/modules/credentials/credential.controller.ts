import { Response } from 'express';
import { credentialService } from './credential.service.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

export class CredentialController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const list = await credentialService.getCredentials(req.query);
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async reveal(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await credentialService.revealSecret(req.params.id as string);
      if (!result) {
        res.status(404).json({ error: 'Credential not found' });
        return;
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectId, name, secretValue } = req.body;
      if (!projectId || !name || !secretValue) {
        res.status(400).json({ error: 'projectId, name, and secretValue are required' });
        return;
      }

      const author = req.user?.name || 'Admin';
      const created = await credentialService.createCredential(req.body, author);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const author = req.user?.name || 'Admin';
      const updated = await credentialService.updateCredential(req.params.id as string, req.body, author);
      if (!updated) {
        res.status(404).json({ error: 'Credential not found' });
        return;
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const deleted = await credentialService.deleteCredential(req.params.id as string);
      if (!deleted) {
        res.status(404).json({ error: 'Credential not found' });
        return;
      }
      res.json({ message: 'Credential deleted successfully', id: req.params.id as string });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const credentialController = new CredentialController();

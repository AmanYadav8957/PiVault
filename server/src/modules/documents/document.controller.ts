import { Response } from 'express';
import { documentService } from './document.service.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

export class DocumentController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const docs = await documentService.getDocuments(req.query);
      res.json(docs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const doc = await documentService.getDocumentById(req.params.id as string);
      if (!doc) {
        res.status(404).json({ error: 'Document not found' });
        return;
      }
      res.json(doc);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectId, title } = req.body;
      if (!projectId || !title) {
        res.status(400).json({ error: 'projectId and title are required' });
        return;
      }

      const authorName = req.user?.name || 'Project Lead';
      const authorAvatar = req.user?.avatar || '';

      const created = await documentService.createDocument(req.body, authorName, authorAvatar);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const updated = await documentService.updateDocument(req.params.id as string, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Document not found' });
        return;
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const deleted = await documentService.deleteDocument(req.params.id as string);
      if (!deleted) {
        res.status(404).json({ error: 'Document not found' });
        return;
      }
      res.json({ message: 'Document deleted successfully', id: req.params.id as string });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const documentController = new DocumentController();

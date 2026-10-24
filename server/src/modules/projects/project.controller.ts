import { Response } from 'express';
import { projectService } from './project.service.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

export class ProjectController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const projects = await projectService.getAllProjects();
      res.json(projects);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const project = await projectService.getProjectById(req.params.id as string);
      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }
      res.json(project);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ error: 'Project name is required' });
        return;
      }

      const project = await projectService.createProject(req.body, req.user);
      res.status(201).json(project);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const project = await projectService.updateProject(req.params.id as string, req.body);
      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }
      res.json(project);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const deleted = await projectService.deleteProject(req.params.id as string);
      if (!deleted) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }
      res.json({ message: 'Project and all associated resources deleted successfully', id: req.params.id as string });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const projectController = new ProjectController();

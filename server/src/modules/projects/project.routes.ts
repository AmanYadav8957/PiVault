import { Router } from 'express';
import { projectController } from './project.controller.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticate, (req, res) => projectController.getAll(req, res));
router.get('/:id', authenticate, (req, res) => projectController.getById(req, res));
router.post(
  '/',
  authenticate,
  requireRole(['Super Admin', 'Admin']),
  (req, res) => projectController.create(req, res)
);
router.put(
  '/:id',
  authenticate,
  requireRole(['Super Admin', 'Admin']),
  (req, res) => projectController.update(req, res)
);
router.delete(
  '/:id',
  authenticate,
  requireRole(['Super Admin', 'Admin']),
  (req, res) => projectController.delete(req, res)
);

export default router;

import { Router } from 'express';
import { userController } from './user.controller.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticate, (req, res) => userController.getAll(req, res));
router.post(
  '/',
  authenticate,
  requireRole(['Super Admin', 'Admin']),
  (req, res) => userController.create(req, res)
);
router.put(
  '/:id',
  authenticate,
  requireRole(['Super Admin', 'Admin']),
  (req, res) => userController.update(req, res)
);
router.delete(
  '/:id',
  authenticate,
  requireRole(['Super Admin']),
  (req, res) => userController.delete(req, res)
);
router.post(
  '/:id/toggle-project',
  authenticate,
  requireRole(['Super Admin', 'Admin']),
  (req, res) => userController.toggleProject(req, res)
);

export default router;

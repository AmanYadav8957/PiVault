import { Router } from 'express';
import { documentController } from './document.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticate, (req, res) => documentController.getAll(req, res));
router.get('/:id', authenticate, (req, res) => documentController.getById(req, res));
router.post('/', authenticate, (req, res) => documentController.create(req, res));
router.put('/:id', authenticate, (req, res) => documentController.update(req, res));
router.delete('/:id', authenticate, (req, res) => documentController.delete(req, res));

export default router;

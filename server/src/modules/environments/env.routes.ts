import { Router } from 'express';
import { envController } from './env.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticate, (req, res) => envController.getAll(req, res));
router.post('/', authenticate, (req, res) => envController.create(req, res));
router.post('/bulk', authenticate, (req, res) => envController.bulkImport(req, res));
router.put('/:id', authenticate, (req, res) => envController.update(req, res));
router.delete('/:id', authenticate, (req, res) => envController.delete(req, res));

export default router;

import { Router } from 'express';
import { credentialController } from './credential.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticate, (req, res) => credentialController.getAll(req, res));
router.get('/:id/reveal', authenticate, (req, res) => credentialController.reveal(req, res));
router.post('/', authenticate, (req, res) => credentialController.create(req, res));
router.put('/:id', authenticate, (req, res) => credentialController.update(req, res));
router.delete('/:id', authenticate, (req, res) => credentialController.delete(req, res));

export default router;

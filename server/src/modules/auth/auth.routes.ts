import { Router } from 'express';
import { authController } from './auth.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', (req, res) => authController.login(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));
router.get('/me', authenticate, (req, res) => authController.getMe(req, res));
router.post('/switch-role', authenticate, (req, res) => authController.switchRole(req, res));

export default router;

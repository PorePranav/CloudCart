import { Router } from 'express';
import {
  loginController,
  signupController,
  verifyUserController,
} from '../controllers/authController';

const router = Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/verifyUser', verifyUserController);

export default router;

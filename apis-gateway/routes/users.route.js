import express from 'express';
import { loginUser, locationGuard } from '../controllers/users.controller.js';
import { config, buildPath } from '../config/api.config.js';
import { authenticateToken } from '../middleware/auth.middleware.js';


const router = express.Router();

const { users } = config.endpoints;

// Public routes (no token needed)
router.post(buildPath(users.base, users.login), loginUser);


//router.post(buildPath(users.base, users.signup), userCtrl.SignUp);
//router.post(buildPath(users.base, users.checkName), userCtrl.CheckUsernameAvailability);
// Protected routes (token required)
router.get(buildPath(users.base, users.location), authenticateToken, locationGuard);

export default router;
import { Router } from 'express';

import authorize from '~/middleware/authorize';
import AuthRoutes from '~/modules/auth/auth-route';
import UserRoute from '~/modules/users/user-route';

const router = Router();
// Non-auth routes
router.use('/auth', AuthRoutes);

// Auth routes
router.use('/users', UserRoute);

export default router;

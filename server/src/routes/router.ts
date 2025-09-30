import { Router } from 'express';

import authorize from '~/middleware/authorize';
import AuthRoutes from '~/modules/auth/auth-route';
import FoodRoute from '~/modules/foods/food-route';
import UserRoute from '~/modules/users/user-route';
import MuscleRouter from '~/modules/muscles/muscle-route';

const router = Router();
// Non-auth routes
router.use('/auth', AuthRoutes);

// Auth routes
router.use('/users', UserRoute);

// Food routes
router.use('/foods', FoodRoute);

// Muscle routes
router.use('/muscles', MuscleRouter);

export default router;

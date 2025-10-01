import { Router } from 'express';

import authorize from '~/middleware/authorize';
import AuthRoutes from '~/modules/auth/auth-route';
import BodyClassificationRouter from '~/modules/body-classification/body-classification-route';
import EquipmentRoute from '~/modules/equipments/equipment-route';
import FoodRoute from '~/modules/foods/food-route';
import MealRoute from '~/modules/meals/meal-route';
import MuscleRouter from '~/modules/muscles/muscle-route';
import UserRoute from '~/modules/users/user-route';

const router = Router();
// Non-auth routes
router.use('/auth', AuthRoutes);

// Auth routes
router.use('/users', UserRoute);

// Food routes
router.use('/foods', FoodRoute);

// Equipment routes
router.use('/equipments', EquipmentRoute);

// Muscle routes
router.use('/muscles', MuscleRouter);

// Body classification routes
router.use('/body-classifications', BodyClassificationRouter);

// Meal routes
router.use('/meals', MealRoute);

export default router;

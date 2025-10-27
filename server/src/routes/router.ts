import { Router } from 'express';

import authorize from '~/middleware/authorize';
import AIRoute from '~/modules/ai/ai-route';
import AuthRoutes from '~/modules/auth/auth-route';
import BodyClassificationRouter from '~/modules/body-classification/body-classification-route';
import BodyRecordRoute from '~/modules/body-records/body-record-route';
import EquipmentRoute from '~/modules/equipments/equipment-route';
import ExerciseRoute from '~/modules/exercises/exercise-route';
import FavoriteRoute from '~/modules/favorites/favorite-route';
import FoodRoute from '~/modules/foods/food-route';
import GoalRoute from '~/modules/goals/goal-route';
import HistoryRoute from '~/modules/histories/history-route';
import MealRoute from '~/modules/meals/meal-route';
import MuscleRouter from '~/modules/muscles/muscle-route';
import PlanRoute from '~/modules/plans/plan-route';
import UserRoute from '~/modules/users/user-route';
import WorkoutRoute from '~/modules/workouts/workout-route';

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

// Body record routes
router.use('/body-records', BodyRecordRoute);

// Exercise routes
router.use('/exercises', ExerciseRoute);

// Goal routes
router.use('/goals', GoalRoute);

// Workout routes
router.use('/workouts', WorkoutRoute);

// Plan routes
router.use('/plans', PlanRoute);

// Favorite routes
router.use('/favorites', FavoriteRoute);

// History routes
router.use('/histories', HistoryRoute);

// AI routes
router.use('/ai', AIRoute);

export default router;

import { configureStore } from '@reduxjs/toolkit';

import authReducer from '~/store/features/auth-slice';
import avatarReducer from '~/store/features/avatar-slice';
import bodyRecordsReducer from '~/store/features/body-records-slice';
import equipmentsReducer from '~/store/features/equipment-slice';
import exercisesReducer from '~/store/features/exercise-slice';
import favouritesReducer from '~/store/features/favourite-slice';
import foodReducer from '~/store/features/food-slice';
import goalsReducer from '~/store/features/goal-slice';
import historiesReducer from '~/store/features/history-slice';
import mealAisReducer from '~/store/features/meal-ai-slice';
import mealsReducer from '~/store/features/meal-slice';
import musclesReducer from '~/store/features/muscles-slice';
import plansReducer from '~/store/features/plan-slice';
import usersReducer from '~/store/features/users-slice';
import workoutsReducer from '~/store/features/workout-slice';

export default configureStore({
  reducer: {
    auth: authReducer,
    avatar: avatarReducer,
    users: usersReducer,
    foods: foodReducer,
    meals: mealsReducer,
    muscles: musclesReducer,
    equipments: equipmentsReducer,
    exercises: exercisesReducer,
    workouts: workoutsReducer,
    plans: plansReducer,
    histories: historiesReducer,
    favourites: favouritesReducer,
    goals: goalsReducer,
    mealAi: mealAisReducer,
    bodyRecords: bodyRecordsReducer
  }
});

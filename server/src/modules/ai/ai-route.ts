import express, { Router } from 'express';

import authenticate from '~/middleware/authenticate';
import asyncHandler from '~/utils/async-handler';

import AIController from './ai-controller';

const router: Router = express.Router();

router.post('/meals', authenticate(), asyncHandler(AIController.generateMeal));

export default router;

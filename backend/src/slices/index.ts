import { Router } from 'express';
import userOnboardingRoutes from './user-onboarding/routes';

const router = Router();

router.use('/user-onboarding', userOnboardingRoutes);

// Future slices will be added here
// e.g. router.use('/retrospective-board', retrospectiveBoardRoutes);

export default router;

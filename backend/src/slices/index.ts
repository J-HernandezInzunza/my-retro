import { Router } from 'express';
import userRoutes from './user-management/user-management.routes';
import retrospectiveBoardRoutes from './retrospective-board/retrospective-board.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/retrospective', retrospectiveBoardRoutes);
// Future slices will be added here

export default router;

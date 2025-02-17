import { Router } from 'express';
const router = Router();
import { GetExperimentsByUserId, GetExperimentById, CreateExperiment, UpdateExperimentById, DeleteExperimentById } from '../controllers/experiments.controller';

router.get('/experiments/getexperimentslist', GetExperimentsByUserId);
router.get('/experiments/getexperimentbyid', GetExperimentById);

router.post('/experiments/create', CreateExperiment);
router.post('/experiments/updateexperiment', UpdateExperimentById);
router.post('/experiments/deleteexperiment', DeleteExperimentById);

export default router;
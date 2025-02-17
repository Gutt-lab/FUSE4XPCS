import { Router } from 'express';
const router = Router();
import { GetSamplesByUserId, GetSampleById, CreateSample, UpdateSampleById, DeleteSampleById } from '../controllers/samples.controller';

router.get('/samples/getsampleslist', GetSamplesByUserId);
router.get('/samples/linkedexpgetsampleslist', GetSamplesByUserId);
router.get('/samples/getsamplebyid', GetSampleById);


router.post('/samples/create', CreateSample);
router.post('/samples/updatesample', UpdateSampleById);
router.post('/samples/deletesample', DeleteSampleById);

export default router;
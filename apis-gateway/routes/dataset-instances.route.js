import { Router } from 'express';
const router = Router();
import { GetDatasetInstancesByUserIdAndExperimentId, GetDatasetInstancesByUserId, GetDatasetInstanceById, CreateDatasetInstance } from '../controllers/dataset-instances.controller';

router.get('/datasetinstances/getdatasetinstanceslistlinkedexp', GetDatasetInstancesByUserIdAndExperimentId);
router.get('/datasetinstances/getdatasetinstanceslist', GetDatasetInstancesByUserId);
router.get('/dataset_instances/getdataset_instancebyid', GetDatasetInstanceById);

router.post('/dataset_instances/create', CreateDatasetInstance);


//router.post('/experiments/create', expCtrl.CreateExperiment);
//router.post('/experiments/updateexperiment', expCtrl.UpdateExperimentById);
//router.post('/experiments/deleteexperiment', expCtrl.DeleteExperimentById);

export default router;
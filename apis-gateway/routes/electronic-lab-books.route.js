
import { Router } from 'express';
const router = Router();
import { CreateExperimentLabBook, GetLabBookListByID, UpdateLabBookListByDOI, UpdateLabBookListTitleByDOI, GetLabBookLinkedDatasetsById } from '../controllers/electronic-lab-book.controllers';


router.post('/createlabbook', CreateExperimentLabBook);
router.get('/getlabbooklist', GetLabBookListByID);
router.post('/updatelabbook', UpdateLabBookListByDOI);
router.post('/updatelabbooktitle', UpdateLabBookListTitleByDOI);
router.get('/getlinkeddatasetsbyelnid', GetLabBookLinkedDatasetsById);


export default router;
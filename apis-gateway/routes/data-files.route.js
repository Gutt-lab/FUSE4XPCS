
import { Router } from 'express';
const router = Router();
import { GetDataFilessByUserId, GetDataFileById, uploadS3, UploadSingleFile } from '../controllers/data-files.controller';

router.get('/datafiles/getdatafileslist', GetDataFilessByUserId);
router.get('/data_files/getdata_filebyid', GetDataFileById);
router.post('/data_files/uploadfile', uploadS3.single('file'),UploadSingleFile)

//router.post('/data_files/uploadfile', dataFilesCtrl.uploadS3.single('body/file'), dataFilesCtrl.UploadSingleFile);
// router.post('/uploadfile', datasetCtrl.uploadS3.single('file'), datasetCtrl.UploadSingleFile);
// router.post('/addfiletodatabases', datasetCtrl.AddFileToDatabases);
// // router.post('/saveattach', upload_attach.single('file'), datasetCtrl.SaveAttachedFile);
// // router.get('/getattachedfilesbydoi', datasetCtrl.GetAttachedFilesByDatasetDoi);
// router.post('/deletedatasetbydoi', datasetCtrl.DeleteDatasetByDOI);
// router.post('/addmetadataitem', datasetCtrl.AddMetadataItem);
// router.get('/getmetadatabydoi', datasetCtrl.GetMetadataByDatasetDoi);
// // router.get('/getdatasetactivites', datasetCtrl.GetDatasetActivitiesByDoi);
// // router.post('/insertdatasetactivity', datasetCtrl.AddDatasetActivity);
// router.post('/deletemetadataitem', datasetCtrl.DeleteMetadataByDatasetDoi);
// router.post('/editmetadataitem', datasetCtrl.EditMetadataByDatasetDoi);
// router.get('/getdatasetsbyuserid', datasetCtrl.GetDatasetsByUserId);


export default router;
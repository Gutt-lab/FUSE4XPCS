import express from 'express';
import { DatasetInstanceMetadataRepository } from '../../repositories/datasetInstance.metadata.repository.js';
import { DatasetInstanceMetadataService } from '../../../domain/service/datasetInstance.metadata.service.js';
import { DatasetInstanceMetadataController } from '../controllers/datasetInstance.metadata.controller.js';

export class DatasetInstanceMetadataRouter {
    constructor(mysql_db_connection, mongo_db) {
        this.datasetInstanceMDRepo = new DatasetInstanceMetadataRepository(mysql_db_connection, mongo_db);
        this.datasetInstanceService = new DatasetInstanceMetadataService(this.datasetInstanceMDRepo);
        this.controller = new DatasetInstanceMetadataController(this.datasetInstanceService);
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/list/by-userid/:id', this.controller.getAllDatasetInstancesByUserId.bind(this.controller));
        this.router.get('/list', this.controller.getAllDatasetInstances.bind(this.controller));
        this.router.get('/datasetInstance/by-id/:id', this.controller.getDatasetInstanceById.bind(this.controller));
    }
    
    getRouter() {
        return this.router;
    }
}

// Factory function to create router instance
export const createDatasetInstanceMetadataRouter = (mysql_db, mongo_db) => {
    const datasetInstanceRouter = new DatasetInstanceMetadataRouter(mysql_db, mongo_db);
    return datasetInstanceRouter.getRouter();
}; 
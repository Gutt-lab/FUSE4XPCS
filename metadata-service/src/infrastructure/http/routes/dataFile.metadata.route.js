import express from 'express';
import { DataFileMetadataRepository } from '../../repositories/dataFile.metadata.repository.js';
import { DataFileMetadataService } from '../../../domain/service/dataFile.metadata.service.js';
import { DataFileMetadataController } from '../controllers/dataFile.metadata.controller.js';

export class DataFileMetadataRouter {
    constructor(mysql_db_connection, mongo_db) {
        this.dataFileRepo = new DataFileMetadataRepository(mysql_db_connection, mongo_db);
        this.dataFileService = new DataFileMetadataService(this.dataFileRepo);
        this.controller = new DataFileMetadataController(this.dataFileService);
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/list', this.controller.getAllDataFiles.bind(this.controller));
        this.router.get('/list/by-userid/:id', this.controller.getAllDataFilesByUserId.bind(this.controller));
        this.router.get('/dataFile/by-id/:id', this.controller.getDataFileById.bind(this.controller));
        this.router.post('/dataFile/create', this.controller.createDataFile.bind(this.controller));

    }
    
    getRouter() {
        return this.router;
    }
}

// Factory function to create router instance
export const createDataFileMetadataRouter = (mysql_db, mongo_db) => {
    const dataFileRouter = new DataFileMetadataRouter(mysql_db, mongo_db);
    return dataFileRouter.getRouter();
}; 
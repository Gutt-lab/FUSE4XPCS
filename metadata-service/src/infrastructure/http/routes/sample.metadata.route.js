import express from 'express';
import { SampleMetadataRepository } from "../../repositories/sample.metadata.repository.js";
import { SampleMetadataService } from "../../../domain/service/sample.metadata.service.js";
import { SampleMetadataController } from "../controllers/sample.metadata.controller.js";

export class SampleMetadataRouter {
    constructor(mysql_db_connection, mongo_db) {
        this.sampleMDRepo = new SampleMetadataRepository(mysql_db_connection, mongo_db);
        this.sampleService = new SampleMetadataService(this.sampleMDRepo);
        this.controller = new SampleMetadataController(this.sampleService);
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/list/by-userid/:id', this.controller.getAllSamplesByUserId.bind(this.controller));
        this.router.get('/list', this.controller.getAllSamples.bind(this.controller));
        this.router.get('/sample/by-sampleid/:id', this.controller.getSampleById.bind(this.controller));
    }
    
    getRouter() {
        return this.router;
    }
}

// Factory function to create router instance
export const createSampleMetadataRouter = (mysql_db, mongo_db) => {
    const sampleRouter = new SampleMetadataRouter(mysql_db, mongo_db);
    return sampleRouter.getRouter();
}; 
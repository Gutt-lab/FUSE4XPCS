import express from 'express';
import { ExperimentMetadataRepository } from "../../repositories/experiment.metadata.repository.js";
import { ExperimentMetadataService } from "../../../domain/service/experiment.metadata.service.js";
import { ExperimentMetadataController } from "../controllers/experiment.metadata.controller.js";


export class ExperimentMetadataRouter {
    constructor(mysql_db_connection, mongo_db) {
        this.experimenMDRepo =  new ExperimentMetadataRepository(mysql_db_connection, mongo_db)
        this.experimentService = new ExperimentMetadataService(this.experimenMDRepo)
        this.controller = new ExperimentMetadataController(this.experimentService);
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/list/by-userid/:id', this.controller.getAllExperimentsByUserId.bind(this.controller));
        this.router.get('/list', this.controller.getAllExperiments.bind(this.controller));
        this.router.get('/experiment/by-experimentid/:id', this.controller.getExperimentsById.bind(this.controller));

    }
    
    getRouter() {
        return this.router;
    }

}

// Factory function to create router instance
export const createExperimentMetadataRouter = (mysql_db, mongo_db) => {
    const experimentRouter = new ExperimentMetadataRouter(mysql_db, mongo_db);
    return experimentRouter.getRouter();
}; 
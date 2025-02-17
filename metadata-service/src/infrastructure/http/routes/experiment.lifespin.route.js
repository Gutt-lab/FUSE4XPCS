import express from 'express';
import { ExperimentLifespinRepository } from "../../repositories/experiment.lifespin.repository.js";
import { ExperimentLifespinService } from "../../../domain/service/experiment.lifespin.service.js";
import { ExperimentLifespinController } from "../controllers/experiment.lifespin.controller.js";


export class ExperimentLifespinRouter {
    constructor(db) {
        this.experimentRepo =  new ExperimentLifespinRepository(db)
        this.experimentService = new ExperimentLifespinService(this.experimentRepo)
        this.controller = new ExperimentLifespinController(this.experimentService);
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/get-all-by-userid/:id', this.controller.getAllExperimentsByUserId.bind(this.controller));
        this.router.get('/get-by-experimentid/:id', this.controller.getExperimentsById.bind(this.controller));

    }
    
    getRouter() {
        return this.router;
    }

}

// Factory function to create router instance
export const createExperimentLifespinRouter = (db) => {
    const experimentRouter = new ExperimentLifespinRouter(db);
    return experimentRouter.getRouter();
}; 
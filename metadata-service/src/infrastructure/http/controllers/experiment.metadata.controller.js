export class ExperimentMetadataController {
    constructor(experimentService) {
        this.experimentService = experimentService;
    }

    async getAllExperiments(req, res, next) {
        try {
            const experiments = await this.experimentService.findAll();
            res.json(experiments);
        } catch (error) {
            next(error);
        }
    }

    async getAllExperimentsByUserId(req, res, next) {
        try {
            const experiments = await this.experimentService.findAllByUserId(req.params.id);
            if (!experiments) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(experiments);
        } catch (error) {
            next(error);
        }
    }

    async getExperimentById(req, res, next) {
        try {
            const experiment = await this.experimentService.findById(req.params.id);
            if (!experiment) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(experiment);
        } catch (error) {
            console.error('Error in ExperimentMetadataController.getExperimentById:', error);
            res.status(500).json({error: error.message || 'An error occurred while creating the experiment.'});
        }
    }

    async createExperiment(req, res, next) {
        try {
            const experimentId = await this.experimentService.createExperiment(req);
            res.status(201).json({ experimentId }); // Return the ID of the created experiment
        } catch (error) {
            console.error('Error in ExperimentMetadataController.createExperiment:', error);
            res.status(500).json({error: error.message || 'An error occurred while creating the experiment.'});
        }
    }
} 
export class ExperimentLifespinController {
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

    async getExperimentsById(req, res, next) {
        try {
            const experiments = await this.experimentService.findByExperimentId(req.params.id);
            if (!experiments) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(experiments);
        } catch (error) {
            next(error);
        }
    }
} 
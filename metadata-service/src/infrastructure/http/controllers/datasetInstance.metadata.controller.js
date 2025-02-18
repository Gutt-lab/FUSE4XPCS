export class DatasetInstanceMetadataController {
    constructor(datasetInstanceService) {
        this.datasetInstanceService = datasetInstanceService;
    }

    async getAllDatasetInstancesByUserId(req, res, next) {
        try {
            const userId = req.params.id;
            const datasetInstances = await this.datasetInstanceService.findAllByUserId(userId);
            res.json(datasetInstances);
        } catch (error) {
            console.error('Error in getAllDatasetInstancesByUserId:', error);
            next(error);
        }
    }

    async getAllDatasetInstances(req, res, next) {
        try {
            const datasetInstances = await this.datasetInstanceService.findAll();
            res.json(datasetInstances);
        } catch (error) {
            console.error('Error in getAllDatasetInstances:', error);
            next(error);
        }
    }

    async getDatasetInstanceById(req, res, next) {
        try {
            const id = req.params.id;
            const datasetInstance = await this.datasetInstanceService.findById(id);
            if (!datasetInstance) {
                return res.status(404).json({ message: 'Dataset instance not found' });
            }
            res.json(datasetInstance);
        } catch (error) {
            console.error('Error in getDatasetInstanceById:', error);
            next(error);
        }
    }
} 
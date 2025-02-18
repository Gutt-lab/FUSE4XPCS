export class DatasetInstanceMetadataService {
    constructor(datasetInstanceRepository) {
        this.datasetInstanceRepository = datasetInstanceRepository;
    }

    async findAll() {
        try {
            return await this.datasetInstanceRepository.findAll();
        } catch (error) {
            console.error('Error in datasetInstanceService.findAll:', error);
            throw error;
        }
    }

    async findAllByUserId(userId) {
        try {
            return await this.datasetInstanceRepository.findAllByUserId(userId);
        } catch (error) {
            console.error('Error in datasetInstanceService.findAllByUserId:', error);
            throw error;
        }
    }

    async findDatasetInstanceById(datasetInstanceId) {
        try {
            return await this.datasetInstanceRepository.findById(datasetInstanceId);
        } catch (error) {
            console.error('Error in datasetInstanceService.findById:', error);
            throw error;
        }
    }

} 
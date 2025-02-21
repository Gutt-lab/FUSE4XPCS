export class DataFileMetadataService {
    constructor(dataFileRepository) {
        this.dataFileRepository = dataFileRepository;
    }

    async findAll() {
        try {
            return await this.dataFileRepository.findAll();
        } catch (error) {
            console.error('Error in dataFileService.findAll:', error);
            throw error;
        }
    }

    async findByUserId(userId) {
        try {
            return await this.dataFileRepository.findByUserId(userId);
        } catch (error) {
            console.error('Error in dataFileService.findAllByUserId:', error);
            throw error;
        }
    }

    async findById(dataFileId) {
        try {
            return await this.dataFileRepository.findByDataFileId(dataFileId);
        } catch (error) {
            console.error('Error in dataFileService.findById:', error);
            throw error;
        }
    }

    // Add more methods as needed for your application
} 
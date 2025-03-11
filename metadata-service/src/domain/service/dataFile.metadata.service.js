
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
            return await this.dataFileRepository.findById(dataFileId);
        } catch (error) {
            console.error('Error in dataFileService.findById:', error);
            throw error;
        }
    }
    async create(dataFileMetadata) {
        try {
            return await this.dataFileRepository.create(dataFileMetadata);
        } catch (error) {
            console.error('Error in dataFileService.create:', error);
            throw error;
        }
    }

    async delete(dataFileId, userID) {
        try {
            return await this.dataFileRepository.delete(dataFileId, userID);
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    async fileExists(dataFileName, dataFileId) {
        try {
            return await this.dataFileRepository.fileExists(dataFileName, dataFileId);
        } catch (error) {
            console.error('Error in dataFileService.fileExists:', error);
            throw error;
        }
    }

} 
export class SampleMetadataService {
    constructor(sampleRepository) {
        this.sampleRepository = sampleRepository;
    }

    async findAll() {
        try {
            return await this.sampleRepository.findAll();
        } catch (error) {
            console.error('Error in SampleService.findAll:', error);
            throw error;
        }
    }


    async findAllByUserId(userId) {
        try {
            const sample = await this.sampleRepository.findAllByUserId(userId);
            if (!sample) {
                throw new Error('sample not found');
            }
            return sample;
        } catch (error) {
            console.error('Error in sampleService.findAllByUserId:', error);
            throw error;
        }
    }


    async findBySampleId(sampleId) {
        try {
            const sample = await this.sampleRepository.findBysampleId(sampleId);
            if (!sample) {
                throw new Error('sample not found');
            }
            return sample;
        } catch (error) {
            console.error('Error in sampleService.findBysampletId:', error);
            throw error;
        }
    }
} 
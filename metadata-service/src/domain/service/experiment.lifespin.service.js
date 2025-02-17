export class ExperimentLifespinService {
    constructor(experimentRepository) {
        this.experimentRepository = experimentRepository;
    }

    async findAll() {
        try {
            return await this.experimentRepository.findAll();
        } catch (error) {
            console.error('Error in experimentService.findAll:', error);
            throw error;
        }
    }


    async findAllByUserId(userId) {
        try {
            const experiment = await this.experimentRepository.findAllByUserId(userId);
            if (!experiment) {
                throw new Error('experiment not found');
            }
            return experiment;
        } catch (error) {
            console.error('Error in experimentService.findAllByUserId:', error);
            throw error;
        }
    }


    async findByExperimentId(experimentId) {
        try {
            const experiment = await this.experimentRepository.findByExperimentId(experimentId);
            if (!experiment) {
                throw new Error('experiment not found');
            }
            return experiment;
        } catch (error) {
            console.error('Error in experimentService.findByExperimentId:', error);
            throw error;
        }
    }
} 
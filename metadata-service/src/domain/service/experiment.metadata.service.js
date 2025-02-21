import { Experiment } from '../entities/experiment.entity.js';

export class ExperimentMetadataService {
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
            const experiments = await this.experimentRepository.findAllByUserId(userId);
            if (!experiments) {
                throw new Error('experiment not found');
            }
            return experiments;
        } catch (error) {
            console.error('Error in experimentService.findAllByUserId:', error);
            throw error;
        }
    }


    async findById(experimentId) {
        try {
            const experiment = await this.experimentRepository.findById(experimentId);
            if (!experiment) {
                throw new Error('experiment not found');
            }
            return experiment;
        } catch (error) {
            console.error('Error in experimentService.findByExperimentId:', error);
            throw error;
        }
    }

    async createExperiment(req) {
        // Extract values from the request
        const ownerId = req.headers.owner_id;
        const name = req.body.experiment_name;
        const facilityId = req.body.experiment_facility_id;
        const startDate = req.body.experiment_start_date;
        const endDate = req.body.experiment_end_date;
        // Create an Experiment instance
        const newExperiment = new Experiment(ownerId, name, facilityId, startDate, endDate);
        
        try {
            newExperiment.validate();
            return await this.experimentRepository.createExperiment(newExperiment);
        } catch (error) {
            console.error('Error in ExperimentMetadataService.createExperiment:', error);
            throw error; // Rethrow the error to be handled by the controller
        }
    }
} 
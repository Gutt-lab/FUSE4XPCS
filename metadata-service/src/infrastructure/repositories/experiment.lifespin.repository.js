import { BaseRepositoryPort } from '../../domain/ports/metadata.repository.port.js';

export class ExperimentLifespinRepository extends BaseRepositoryPort {
    constructor(db) {
        super();
        this.collection = db.collection('experiments');
       
    }

    async findAll() {
        try {
            return await this.collection.find({}).toArray();
        } catch (error) {
            console.error(`MongoDB findAll error for ${this.collection.collectionName}:`, error);
            throw error;
        }
    }

    async findAllByUserId(user_id) {
        try {
            const experiments_data = await this.collection.find({ user_id: Number(user_id) }).toArray();

            return experiments_data
        } catch (error) {
            console.error('MongoDB findAllByUserId error:', error);
            throw error;
        }
    }

    async findByExperimentId(experimentId) {
        try {
            const experiment_data = await this.collection.findOne({ experiment_id: Number(experimentId) });

            return experiment_data
        } catch (error) {
            console.error('MongoDB findAllByUserId error:', error);
            throw error;
        }
    }
}
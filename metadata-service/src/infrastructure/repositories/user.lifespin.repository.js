import { BaseRepositoryPort } from '../../domain/ports/metadata.repository.port.js';

export class UserLifespinRepository extends BaseRepositoryPort {
    constructor(db) {
        super();
        this.collection = db.collection('users');
       
    }

    async findAll() {
        try {
            return await this.collection.find({}).toArray();
        } catch (error) {
            console.error(`MongoDB findAll error for ${this.collection.collectionName}:`, error);
            throw error;
        }
    }

    async findByUserId(user_id) {
        try {
            const user_data = await this.collection.findOne({ user_id: Number(user_id) });

            return user_data
        } catch (error) {
            console.error('MongoDB findByUserId error:', error);
            throw error;
        }
    }
}
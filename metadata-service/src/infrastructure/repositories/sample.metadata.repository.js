import { BaseRepositoryPort } from '../../domain/ports/metadata.repository.port.js';

export class SampleMetadataRepository extends BaseRepositoryPort {
    constructor(mysql_db, mongo_db) {
        super();
        this.collection = mongo_db.collection('samples');
        this.mysql_db_connection = mysql_db
       
    }

    async findAll() {
        try {
            const query = 'SELECT * FROM samples_list'
            const [samples_data] = await this.mysql_db_connection.promise().query(query);
            for (let index = 0; index < samples_data.length; index++) {
                const sample = samples_data[index];
                const linked_experiments_data = await this.findLinkedExperimentsBySampleId(sample.sample_id)
                sample.linked_experiments = linked_experiments_data
                const sample_metadata = await this.findBySampletId(sample.sample_id)
                sample.lifespin_metadata = sample_metadata
            }
            return samples_data
        } catch (error) {
            console.error(`${this.findAll.name} error:`, error);
            throw error;
        }
    }

    async findAllByUserId(user_id) {
        const query = `
        SELECT 
            samples_list.*, 
            DATE_FORMAT(samples_list.sample_added_on, '%d.%m.%Y') AS 'sample_added_on',
            users.login_name AS 'sample_owner_name'
        FROM 
            samples_list
        INNER JOIN 
            users ON users.user_id = samples_list.sample_owner_id
        WHERE 
            sample_owner_id = ?
        `;

        const values = [Number(user_id)]
        try {
            const [samples_data] = await this.mysql_db_connection.promise().query(query, values);
            for (let index = 0; index < samples_data.length; index++) {
                const sample = samples_data[index];
                const linked_experiments_data = await this.findLinkedExperimentsBySampleId(sample.sample_id)
                sample.linked_experiments = linked_experiments_data
                const sample_metadata = await this.findBySampletId(sample.sample_id)
                sample.lifespin_metadata = sample_metadata
            }
            return experiments_data
        } catch (error) {
            console.error(`${this.findAllByUserId.name} error:`, error);
            throw error;
        }
    }

    async findBySampletId(sampleId) {
        try {
            const sample_data = await this.collection.findOne({ sample_id: Number(sampleId) });
            return sample_data
        } catch (error) {
            console.error(`${this.findBySampletId.name} error:`, error);
            throw error;
        }
    }

    async findLinkedExperimentsBySampleId(sampleId){
        
        const query = 'SELECT link_experiment_id FROM link_experiments_samples WHERE link_sample_id = ?'
        const values = [Number(sampleId)]
        try {
            const [linked_experiments_ids] = await this.mysql_db_connection.promise().query(query, values);
            let link_experiments_samples_data = []
            for (let index = 0; index < linked_experiments_ids.length; index++) {
                const experiment_id = linked_experiments_ids[index].link_experiment_id;           
                var experiment_query = 'SELECT * FROM experiments_list WHERE experiment_id = ?'
                var experiment_values = [Number(experiment_id)]
                const [experiments_data] = await this.mysql_db_connection.promise().query(experiment_query, experiment_values);
                link_experiments_samples_data.push(experiments_data)
            }
            return link_experiments_samples_data
        } catch (error) {
            console.error(`${this.findLinkedExperimentsBySampleId.name} error:`, error);
            throw error;
        }
    }
}
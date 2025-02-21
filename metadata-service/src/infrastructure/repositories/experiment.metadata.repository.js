import { ExperimentRepositoryPort } from '../../domain/ports/metadata.repository.port.js';
import { v4 as uuidv4 } from 'uuid';

export class ExperimentMetadataRepository extends ExperimentRepositoryPort {
    constructor(mysql_db, mongo_db) {
        super();
        this.collection = mongo_db.collection('experiments');
        this.mysql_db_connection = mysql_db
       
    }

    async findAll() {
        try {
            const query = 'SELECT * FROM experiments_list'
            const [experiments_data] = await this.mysql_db_connection.promise().query(query);
            for (let index = 0; index < experiments_data.length; index++) {
                const experiment = experiments_data[index];
                const exp_metadata = await this.findLifeSpinById(experiment.experiment_id)
                experiment.lifespin_metadat = exp_metadata
            }
            return experiments_data
        } catch (error) {
            console.error(`${this.findAll.name} error:`, error);
            throw error;
        }
    }

    async findAllByUserId(user_id) {
        const query = `
        SELECT 
            experiments_list.*, 
            facility_list.facility_name, 
            DATE_FORMAT(experiments_list.experiment_added_on, '%d.%m.%Y') AS 'experiment_added_on',
            DATE_FORMAT(experiments_list.experiment_start_date, '%d.%m.%Y') AS 'experiment_start_date',
            DATE_FORMAT(experiments_list.experiment_end_date, '%d.%m.%Y') AS 'experiment_end_date',
            users.login_name AS 'experiment_owner_name'
        FROM 
            experiments_list
        INNER JOIN 
            users ON users.user_id = experiments_list.experiment_owner_id
        INNER JOIN 
            facility_list ON facility_list.facility_id = experiments_list.experiment_facility_id
        WHERE 
            experiment_owner_id = ?
        `;

        const values = [Number(user_id)]
        try {
            const [experiments_data] = await this.mysql_db_connection.promise().query(query, values);
            for (let index = 0; index < experiments_data.length; index++) {
                const experiment = experiments_data[index];
                const linked_samples_data = await this.findLinkedSamplesByExperimentId(experiment.experiment_id)
                experiment.linked_samples = linked_samples_data
                const linked_dataset_instances_data = await this.findLinkedDataInstancesByExperimentId(experiment.experiment_id)
                experiment.linked_dataset_instances_data = linked_dataset_instances_data
                const exp_metadata = await this.findLifeSpinById(experiment.experiment_id)
                experiment.lifespin_metadata = exp_metadata
            }
            return experiments_data
        } catch (error) {
            console.error(`${this.findAllByUserId.name} error:`, error);
            throw error;
        }
    }

    async findById(experimentId) {
        const query = `
        SELECT 
            experiments_list.*, 
            facility_list.facility_name, 
            DATE_FORMAT(experiments_list.experiment_added_on, '%d.%m.%Y') AS 'experiment_added_on',
            DATE_FORMAT(experiments_list.experiment_start_date, '%d.%m.%Y') AS 'experiment_start_date',
            DATE_FORMAT(experiments_list.experiment_end_date, '%d.%m.%Y') AS 'experiment_end_date',
            users.login_name AS 'experiment_owner_name'
        FROM 
            experiments_list
        INNER JOIN 
            users ON users.user_id = experiments_list.experiment_owner_id
        INNER JOIN 
            facility_list ON facility_list.facility_id = experiments_list.experiment_facility_id
        WHERE 
            experiment_id = ?
        `;

        const values = [Number(experimentId)]

        try {
            const [experiment_data] = await this.mysql_db_connection.promise().query(query, values);
            if (experiment_data.length === 0) {
                throw new Error('Experiment not found');
            }
            experiment_data[0].linked_samples = await this.findLinkedSamplesByExperimentId(experimentId)
            experiment_data[0].linked_dataset_instances_data = await this.findLinkedDataInstancesByExperimentId(experimentId)
            experiment_data[0].lifespin_metadata = await this.findLifeSpinById(experimentId)
            return experiment_data
        } catch (error) {
            console.error(`${this.findById.name} error:`, error);
            throw error;
        }
    }

    async findLifeSpinById(experimentId) {
        try {
            const experiment_data = await this.collection.findOne({ experiment_id: Number(experimentId) });
            return experiment_data
        } catch (error) {
            console.error(`${this.findByExperimentId.name} error:`, error);
            throw error;
        }
    }

    async findLinkedSamplesByExperimentId(experimentId){
        
        const query = 'SELECT link_sample_id FROM link_experiments_samples WHERE link_experiment_id = ?'
        const values = [Number(experimentId)]
        try {
            const [linked_samples_ids] = await this.mysql_db_connection.promise().query(query, values);
            let link_experiments_samples_data = []
            for (let index = 0; index < linked_samples_ids.length; index++) {
                const sample_id = linked_samples_ids[index].link_sample_id;           
                var sample_query = 'SELECT * FROM samples_list WHERE sample_id = ?'
                var sample_values = [Number(sample_id)]
                const [samples_data] = await this.mysql_db_connection.promise().query(sample_query, sample_values);
                link_experiments_samples_data.push(samples_data)
            }
            return link_experiments_samples_data
        } catch (error) {
            console.error(`${this.findLinkedSamplesByExperimentId.name} error:`, error);
            throw error;
        }
    }

    async findLinkedDataInstancesByExperimentId(experimentId){
        const query = `
                    SELECT *, 
                        DATE_FORMAT(dataset_instances_list.dataset_instance_added_on, '%d.%m.%Y') AS 'dataset_instance_added_on',
                        DATE_FORMAT(dataset_instances_list.dataset_instance_last_modified_on, '%d.%m.%Y') AS 'dataset_instance_last_modified_on'
                    FROM dataset_instances_list 
                    WHERE dataset_instance_linked_experiment_id = ?
                `;
        const values = [Number(experimentId)];
        
        try {
            const [linked_dataset_instancess_data] = await this.mysql_db_connection.promise().query(query, values);
            return linked_dataset_instancess_data
        } catch (error) {
            console.error(`${this.findLinkedDataInstancesByExperimentId.name} error:`, error);
            throw error;
        }
    }

    async createExperiment(newExperiment) {
        const query = `
            INSERT INTO experiments_list (experiment_owner_id, experiment_name, experiment_facility_id, experiment_start_date, experiment_end_date, experiment_added_on)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        
        const experiment_doi = uuidv4();
        newExperiment
        const values = [
            newExperiment.ownerId,
            newExperiment.name,
            newExperiment.facilityId,
            newExperiment.startDate,
            newExperiment.endDate
        ];

        try {
            const [result] = await this.mysql_db_connection.promise().query(query, values);

            if (!result) {
                throw new Error('Insert operation failed');
            }
            const newExperiment = { experiment_id: result.insertId, experiment_doi:experiment_doi};
            const AddResult =  await this.collection.insertOne(newExperiment)
            console.log(AddResult)
            return this.findById(result.insertId); // Return the newly created experiment
        } catch (error) {
            console.error('Error creating experiment:', error);
            throw error;
        }
    }
}
import { BaseRepositoryPort } from '../../domain/ports/metadata.repository.port.js';

export class DatasetInstanceMetadataRepository extends BaseRepositoryPort {
    constructor(mysql_db, mongo_db) {
        super();
        this.collection = mongo_db.collection('dataset_instances');
        this.mysql_db_connection = mysql_db;
    }

    async findAll() {
        try {
            const query = `
                SELECT dataset_instances_list.*, 
                    DATE_FORMAT(dataset_instances_list.dataset_instance_added_on, '%d.%m.%Y') AS 'dataset_instance_added_on',
                    DATE_FORMAT(dataset_instances_list.dataset_instance_last_modified_on, '%d.%m.%Y') AS 'dataset_instance_last_modified_on',
                    users.login_name AS 'dataset_instance_owner_name',
                    experiments_list.experiment_name AS 'linked_experiment_name'
                FROM 
                    dataset_instances_list
                INNER JOIN 
                    users ON users.user_id = dataset_instances_list.dataset_instance_owner_id
                INNER JOIN 
                    experiments_list ON experiments_list.experiment_id = dataset_instances_list.dataset_instance_linked_experiment_id
            `;
            const [datasetInstancesData] = await this.mysql_db_connection.promise().query(query);
            for (let index = 0; index < datasetInstancesData.length; index++) {
                const datasetInstance = datasetInstancesData[index];
                const metadata = await this.findByDatasetInstanceId(datasetInstance.dataset_instance_id);
                datasetInstance.lifespin_metadata = metadata;
            }
            return datasetInstancesData;
        } catch (error) {
            console.error(`${this.findAll.name} error:`, error);
            throw error;
        }
    }

    async findAllByUserId(user_id) {
        const query = `
            SELECT *, 
                DATE_FORMAT(dataset_instances_list.dataset_instance_added_on, '%d.%m.%Y') AS 'dataset_instance_added_on',
                DATE_FORMAT(dataset_instances_list.dataset_instance_last_modified_on, '%d.%m.%Y') AS 'dataset_instance_last_modified_on',
                users.login_name AS 'dataset_instance_owner_name',
                experiments_list.experiment_name AS 'linked_experiment_name'
            FROM 
                dataset_instances_list
            INNER JOIN 
                users ON users.user_id = dataset_instances_list.dataset_instance_owner_id
            INNER JOIN 
                experiments_list ON experiments_list.experiment_id = dataset_instances_list.dataset_instance_linked_experiment_id
            WHERE 
                dataset_instance_owner_id = ?
        `;
        const values = [Number(user_id)];

        try {
            const [datasetInstances] = await this.mysql_db_connection.promise().query(query, values);
            return datasetInstances;
        } catch (error) {
            console.error('Error executing findAllByUserId query:', error);
            throw error;
        }
    }

    async findByDatasetInstanceId(datasetInstanceId) {
        try {
            const datasetInstanceData = await this.collection.findOne({ dataset_instance_id: Number(datasetInstanceId) });
            return datasetInstanceData;
        } catch (error) {
            console.error(`${this.findByDatasetInstanceId.name} error:`, error);
            throw error;
        }
    }

    // Add more methods as needed for your application
} 
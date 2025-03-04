import { DataFileRepositoryPort } from '../../domain/ports/metadata.repository.port.js';

export class DataFileMetadataRepository extends DataFileRepositoryPort {
    constructor(mysql_db, mongo_db) {
        super(); 
        this.collection = mongo_db.collection('data_files');
        this.mysql_db_connection = mysql_db;
    }
    generateRandomUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    async findAll() {
        try {

            const query = `
            SELECT data_files_list.*, 
                DATE_FORMAT(data_files_list.data_file_added_on, '%d.%m.%Y') AS 'data_file_added_on',
                users.login_name AS 'data_file_owner_name',
                dataset_instances_list.dataset_instance_name AS 'linked_dataset_instance_name',
                experiments_list.experiment_name AS 'linked_experiment_name'
            FROM 
                data_files_list
            INNER JOIN 
                users ON users.user_id = data_files_list.data_file_owner_id
            INNER JOIN 
                dataset_instances_list ON dataset_instances_list.dataset_instance_id = data_files_list.data_file_linked_dataset_instance_id
            INNER JOIN 
                experiments_list ON experiments_list.experiment_id = data_files_list.data_file_linked_experiment_id
        `;

            const [dataFilesData] = await this.mysql_db_connection.promise().query(query);
            for (let index = 0; index < dataFilesData.length; index++) {
                const dataFile = dataFilesData[index];
                const metadata = await this.findById(dataFile.data_file_id); 
                dataFile.lifespin_metadata = metadata;
            }
            return dataFilesData;
        } catch (error) {
            console.error(`${this.findAll.name} error:`, error);
            throw error;
        }
    }

    async findByUserId(user_id) {
        const query = `
            SELECT data_files_list.*, 
                DATE_FORMAT(data_files_list.data_file_added_on, '%d.%m.%Y') AS 'data_file_added_on',
                users.login_name AS 'data_file_owner_name',
                dataset_instances_list.dataset_instance_name AS 'linked_dataset_instance_name',
                experiments_list.experiment_name AS 'linked_experiment_name'
            FROM 
                data_files_list
            INNER JOIN 
                users ON users.user_id = data_files_list.data_file_owner_id
            INNER JOIN 
                dataset_instances_list ON dataset_instances_list.dataset_instance_id = data_files_list.data_file_linked_dataset_instance_id
            INNER JOIN 
                experiments_list ON experiments_list.experiment_id = data_files_list.data_file_linked_experiment_id
            WHERE 
                data_file_owner_id = ?
        `;
        const values = [Number(user_id)];

        try {
            const [dataFiles] = await this.mysql_db_connection.promise().query(query, values);
            return dataFiles;
        } catch (error) {
            console.error('Error executing findAllByUserId query:', error);
            throw error;
        }
    }

    async findById(dataFileId) {
        try {
            const dataFileData = await this.collection.findOne({ data_file_id: Number(dataFileId) });
            return dataFileData; 
        } catch (error) {
            console.error(`${this.findByDataFileId.name} error:`, error);
            throw error;
        }
    }

async create(dataFileMetadata) {
       
    const mysqlQuery = `
    INSERT INTO data_files_list 
        (data_file_name, data_file_owner_id, data_file_doi, data_file_linked_dataset_instance_id, data_file_linked_experiment_id, data_file_pid, data_file_added_on) 
        VALUES (?,?,?,?,?,?, now())
    `;
    const dataFileDOI = this.generateRandomUUID()
    try {
        const values = [
            dataFileMetadata.data_file_name,
            dataFileMetadata.data_file_owner_id,
            dataFileDOI,
            dataFileMetadata.data_file_linked_dataset_instance_id,
            dataFileMetadata.data_file_linked_experiment_id,
            dataFileMetadata.data_file_pid,
        ];

        try {
            const [result] = await this.mysql_db_connection.promise().query(mysqlQuery, values);

            if (!result) {
                throw new Error('Insert operation failed');
            }
            const newDatafile = { data_file_id: result.insertId, data_file_doi:dataFileDOI};
            const AddResult =  await this.collection.insertOne(newDatafile)
            return this.findById(result.insertId); // Return the newly created experiment
        } catch (error) {
            console.error('Error creating data file:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error in create method:', error);
        throw error;
    }
}
} 
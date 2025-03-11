import { DataFileRepositoryPort } from '../../domain/ports/metadata.repository.port.js';
import { ErrorCodes } from "../../enums/errorCodes.js";
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
        const query = `
        SELECT data_files_list.*, 
            DATE_FORMAT(data_files_list.data_file_added_on, '%d.%m.%Y') AS 'data_file_added_on',
            users.login_name AS 'data_file_owner_name',
            dataset_instances_list.dataset_instance_name AS 'linked_dataset_instance_name',
            experiments_list.experiment_name AS 'linked_experiment_name'
        FROM 
            data_files_list
        LEFT JOIN 
            users ON users.user_id = data_files_list.data_file_owner_id
        LEFT JOIN 
            dataset_instances_list ON dataset_instances_list.dataset_instance_id = data_files_list.data_file_linked_dataset_instance_id
        LEFT JOIN 
            experiments_list ON experiments_list.experiment_id = data_files_list.data_file_linked_experiment_id
        WHERE 
            data_file_id = ?
        `;
        const values = [dataFileId];
        
        try {
            const [dataFile] = await this.mysql_db_connection.promise().query(query, values);
            const metadata = await this.collection.findOne({ data_file_id: Number(dataFileId) });
            dataFile[0].lifespin_metadata = metadata;
            return dataFile[0]; 
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
               
                return this.findById(result.insertId); 
            } catch (error) {
                console.error('Error creating data file:', error);
                throw error;
            }
        } catch (error) {
            console.error('Error in create method:', error);
            throw error;
        }
    }

    async delete(dataFileId, userId) {
        
        const canDelete = await this.userRole(dataFileId, userId)
        if (canDelete === -5) {
            throw new Error(ErrorCodes.NOT_FOUND.name);
        }
        if (!canDelete) {
            throw new Error(ErrorCodes.UNAUTHORIZED.name);
        }

        const mysqlQuery = 'DELETE FROM data_files_list WHERE data_file_id = ?';  
        try {
            const [mysqlResult] = await this.mysql_db_connection.promise().query(mysqlQuery, [Number(dataFileId)]);
            if (mysqlResult.affectedRows === 0) {
                throw new Error(ErrorCodes.INTERNAL_SERVER_ERROR.name);
            }

            // Delete from MongoDB collection
            const mongoResult = await this.collection.deleteOne({ data_file_id: Number(dataFileId) });

            if (mongoResult.deletedCount === 0) {
                throw new Error(ErrorCodes.INTERNAL_SERVER_ERROR.name);
            }

            return { message: 'Data file successfully deleted' };
        } catch (error) {
            console.error('Error deleting data file:', error);
            throw error;
        }
    }

    async userRole(dataFileId, userId) {
        const query = `
        SELECT data_file_owner_id
        FROM data_files_list
        WHERE data_file_id = ?
        `;

        const values = [Number(dataFileId)];

        try {
            const [rows] = await this.mysql_db_connection.promise().query(query, values);
            if (rows.length === 0) {
                return -5; 
            }
            return Number(rows[0].data_file_owner_id) == Number(userId);
        } catch (error) {
            console.error('Error fetching user role:', error);
            throw error;
        }
    }

    async fileExists(dataFileName, dataFileId) {
        const query = `
        SELECT COUNT(*) AS count
        FROM data_files_list
        WHERE data_file_name = ? AND data_file_id = ?
        `;
        const values = [dataFileName, Number(dataFileId)];
    
        try {
            const [rows] = await this.mysql_db_connection.promise().query(query, values);
            return rows[0].count > 0;
        } catch (error) {
            console.error('Error checking if file exists:', error);
            throw error;
        }
    }

} 
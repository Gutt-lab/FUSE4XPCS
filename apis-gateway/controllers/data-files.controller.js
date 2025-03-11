import multer from "multer";
import axios from 'axios';
import FormData from 'form-data';


export const upload = multer({ storage: multer.memoryStorage() });

export const uploadSingleFile = async (req, res) => {
    try {

        if (!req.body.data_file_owner_id || !req.body.data_file_name) {
            return res.status(400).json({ message: 'Not enough metadata' });
        }
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const formData = new FormData();
        if(req.headers.host=='localhost:3002')
            {
                formData.append('file', file.buffer, req.body.data_file_name);
            }
        else{
            formData.append('file', file.buffer, file.originalname);
        }
        const response = await axios.post(
            `${process.env.DATAFILES_SERVICE_BASE_URL}/upload`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    client_id: process.env.CLIENT_ID
                }
            }
        );

        if (response.data == -1) {
            return res.status(500).json('Uploading failed');
        }
        if (response.data == -5) {
            res.status(409)
            return res.json('File exist');
        }
        // Respond with the other server's response
        const file_PID = response.data
        const metadataResponse = await axios.post(
            `${process.env.METADATA_SERVICE_BASE_URL}/metadata/dataFiles/v1/dataFile/create`, 
            {
                data_file_name: req.body.data_file_name,
                data_file_owner_id: req.body.data_file_owner_id,
                data_file_linked_dataset_instance_id: req.body.data_file_linked_dataset_instance_id,
                data_file_linked_experiment_id: req.body.data_file_linked_experiment_id,
                data_file_pid: file_PID,
            },
            {
                headers: {
                    client_id: process.env.CLIENT_ID
                }
            }

        )
        res.status(response.status).json(metadataResponse.data);

    } catch (error) {
        res.status(500).json({ message: 'Error processing file', error: error.message });
    }

    
};

export const deleteSingleFile = async (req, res) => {
    try {
        const fileId = req.params.id;
        const fileName  =  req.params.filename;
        const userId = req.headers.user_id
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        if (!fileId) {
            return res.status(400).json({ message: 'File ID is required' });
        }

        if (!fileName) {
            return res.status(400).json({ message: 'File nmae is required' });
        }
        // Check the file is exist in the storage
        const storageResponse = await axios.get(
            `${process.env.DATAFILES_SERVICE_BASE_URL}/files/file/isexist/${fileName}`,
            {
                headers: {
                    client_id: process.env.CLIENT_ID
                }
            }
        );

        // Check the file is exist in the db
        const dbResponse = await axios.get(
            `${process.env.METADATA_SERVICE_BASE_URL}/metadata/dataFiles/v1/dataFile/isexist/${fileId}/${fileName}`,
            {
                headers: {
                    client_id: process.env.CLIENT_ID
                }
            }
        );
        if (!dbResponse.data || !storageResponse.data) {
            return res.status(404).json('File not Found')
        }


        // Send a request to delete the file
        const dbDeletingResponse = await axios.delete(
            `${process.env.METADATA_SERVICE_BASE_URL}/metadata/dataFiles/v1/dataFile/delete/${fileId}/${userId}`,
            {
                headers: {
                    client_id: process.env.CLIENT_ID
                }
            }
        );

        if(!dbDeletingResponse.data){
            return res.status(500).json({ message: 'Internal error' });  
        }

        // Send a request to delete the file
        const storageDeletingResponse = await axios.delete(
            `${process.env.DATAFILES_SERVICE_BASE_URL}/delete/${fileName}`,
            {
                headers: {
                    client_id: process.env.CLIENT_ID
                }
            }
        );

        if (storageDeletingResponse.status === 200) {
            return res.status(200).json({ message: 'File deleted successfully' });
        } else {
            return res.status(storageDeletingResponse.status).json({ message: 'Failed to delete file' });
        }

    } catch (error) {
        res.status(500).json(error);
    }
};



